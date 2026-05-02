import { Component } from '@angular/core';

@Component({
  selector: 'sc-stream-chat-profile',
  imports: [],
  templateUrl: './stream-chat-profile.html',
  styleUrl: './stream-chat-profile.scss',
})
export class StreamChatProfile {
  private user = {
    name: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    status: 'Online',
  }
}
