import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChatLayout } from '@app/components/chat-layout/chat-layout';
import { RouterOutlet, RouterLinkWithHref, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/services/auth/auth-service';
import { ReactiveFormsModule } from '@angular/forms';
import { StreamChatApi } from '@app/api/stream-chat-api';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sc-stream-chat',
  imports: [
    ChatLayout,
    ChatLayout,
    RouterOutlet,
    RouterLinkWithHref,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    AsyncPipe,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './stream-chat.html',
  styleUrl: './stream-chat.scss',
})
export class StreamChat implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private api = inject(StreamChatApi);

  user = this.authService.user;

  rooms$ = isPlatformBrowser(this.platformId) ? this.api.getRooms() : of([]);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
  }
}
