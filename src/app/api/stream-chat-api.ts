import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { AuthResponse } from '@app/types/auth';
import { UserDto } from '@app/types/user';
import { MessageDto } from '@app/types/chat-message';
import { Room } from '@app/types/room';

@Injectable({
  providedIn: 'root',
})
export class StreamChatApi {
  private http = inject(HttpClient);

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { username, password });
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { username, password });
  }

  getMessages(roomId: string): Observable<MessageDto[]> {
    return this.http.get<MessageDto[]>(`${environment.apiUrl}/message/${roomId}`);
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${environment.apiUrl}/users`); 
  }

  getUserDetails(): Observable<{
    sub: string;
    username: string;
  }> {
    return this.http.get<{
      sub: string;
      username: string;
    }>(`${environment.apiUrl}/auth/userDetails`);
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${environment.apiUrl}/room/all`)
  }

  getRoom(roomId: string): Observable<Room>  {
    return this.http.get<Room>(`${environment.apiUrl}/room/${roomId}`)
  }
  
}
