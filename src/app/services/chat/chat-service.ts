import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { MessageDto } from '@app/types/chat-message';
import { SocketService } from '../socket/socket-adapter';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class ChatService {
  private platformId = inject(PLATFORM_ID);
  private socketService = inject(SocketService);
  private _messages = signal<MessageDto[]>([]);

  messageAdded = new Subject<void>();

  messages = this._messages.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.socketService.on<MessageDto>('message').subscribe((message) => {  
      console.log('on recieve chat message:', message);
      this.addMessage(message); 
    });
  }

  loadMessages(messages: MessageDto[]) {
    this._messages.set(messages);
  }

  addMessage(message: MessageDto) {
    this._messages.update((msgs) => [...msgs, message]);

    this.messageAdded.next();
  }

  getParticipants(chatId: string): string[] {
    return [];
  }
}
