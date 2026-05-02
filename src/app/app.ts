import { Component, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon'
import { AuthService } from './services/auth/auth-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SocketService } from './services/socket/socket-adapter';
import { environment } from '../environments/environment';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { StreamMeetingInvitationEvent } from './types/meeting';
import { MeetingService } from './services/meeting/meeting-service';

@Component({
  selector: 'sc-root',
  imports: [RouterOutlet, AsyncPipe, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, MatTooltipModule, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('stream-chat');
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private authService = inject(AuthService);
  private socketService = inject(SocketService);
  private meetingService = inject(MeetingService);

  user = this.authService.user;
  isAuthenticated = this.authService.isAuthenticated;

  authEffect = effect(() => {
    if (this.isAuthenticated()) {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.socketService.initialize(`${environment.wsUrl}?token=${this.authService.getToken()}`);
    }
  });

  meetingInvitation$ = this.meetingService.meetingInvitation$;

  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    // iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
  }

  async handleJoinMeeting(data: StreamMeetingInvitationEvent['payload']) {    
    // Навигация теперь максимально чистая
    this.router.navigate(['stream', 'meeting', data.roomId]);
  }
  
  logout() {
    this.authService.logout();
    this.socketService.disconnect();
  }
}
