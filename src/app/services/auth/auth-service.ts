import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StreamChatApi } from '@app/api/stream-chat-api';
import { UserDetails, UserDto } from '@app/types/user';
import { Storage } from '@app/core/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(StreamChatApi);
  private router = inject(Router)
  private token: string | null = null;
  private _user = signal<UserDto | null>(null);
  private _isAuthenticated = signal(false);


  isAuthenticated = this._isAuthenticated.asReadonly();
  user = this._user.asReadonly();

  userId = computed(() => {
    return this.user()?.id;
  })

  private storage = inject(Storage)

  constructor() {
    this.loadTokenFromStorage();
  }

  register(email: string, password: string): Observable<UserDetails> {
    return this.api.register(email, password).pipe(
      tap(response => {
        this.setToken(response.access_token);
      }),
      switchMap(() => this.api.getUserDetails()),
      tap(response => {
        this._user.set({
          id: response.sub,
          username: response.username,
        });
        this._isAuthenticated.set(true);
      })
    )
  }

  login(email: string, password: string): Observable<UserDetails> {
    return this.api.login(email, password).pipe(
      tap(response => {
        this.setToken(response.access_token);
      }),
      switchMap(() => this.api.getUserDetails()),
      tap(response => {
        this._user.set({
          id: response.sub,
          username: response.username,
        });
        this._isAuthenticated.set(true);
      })
    )
  }

  logout(): void {
    this.clearToken();
    this._user.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/login'])
  }

  setToken(token: string): void {
    this.token = token;
    this.storage.setItem('access_token', token);
    this._isAuthenticated.set(true);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    this.storage.removeItem('access_token');
  }

  private loadTokenFromStorage(): void {
    const token = this.storage.getItem('access_token');
    if (token) {
      this.token = token;
      this._isAuthenticated.set(true);

      this.api.getUserDetails().subscribe({
        next: (response) => {
          this._user.set({
            id: response.sub,
            username: response.username,
          });
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          this.clearToken();
        }
      });
    }
  }
}