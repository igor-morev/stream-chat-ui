import { Component } from '@angular/core';

@Component({
  selector: 'sc-chat-layout',
  imports: [],
  templateUrl: './chat-layout.html',
  styleUrl: './chat-layout.scss',
})
export class ChatLayout {
  viewMode: 'chat' | 'meeting' = 'chat';
}
