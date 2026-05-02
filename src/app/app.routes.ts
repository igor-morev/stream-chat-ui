import { Routes } from '@angular/router';
import { authGuard } from './services/auth/auth-guard';
import { guestGuard } from './services/auth/guest-guard';
import { ChatService } from './services/chat/chat-service';
import { CHAT_VIEW_CONTEXT } from './components/chat-view/chat-view.token';
import { MeetingService } from './services/meeting/meeting-service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./stream-chat-auth/stream-chat-auth').then(m => m.StreamChatAuth),
    canActivate: [guestGuard],
    data: { mode: 'login' }
  },
  {
    path: 'register',
    loadComponent: () => import('./stream-chat-auth/stream-chat-auth').then(m => m.StreamChatAuth),
    canActivate: [guestGuard],
    data: { mode: 'register' }
  },
  {
    path: 'stream',
    providers: [ChatService],
    children: [
      {
        path: 'chat',
        loadChildren: () => import('./stream-chat/stream-chat.routes').then(m => m.StreamChatRoutes),
        canActivate: [authGuard],
      },
      {
        path: 'meeting/:meetingId',
        loadComponent: () => import('./stream-chat-meeting/stream-chat-meeting').then(m => m.StreamChatMeeting),
        canActivate: [authGuard],
        providers: [{
          provide: CHAT_VIEW_CONTEXT,
          useValue: 'meeting'
        }]
      },
      {
        path: 'profile',
        loadComponent: () => import('./stream-chat-profile/stream-chat-profile').then(m => m.StreamChatProfile),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
