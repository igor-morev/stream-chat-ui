import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MessageDto } from '@app/types/chat-message';

@Component({
  selector: 'sc-chat-message',
  imports: [DatePipe],
  templateUrl: './chat-message.html',
  styleUrl: './chat-message.scss',
})
export class ChatMessage {
  message = input.required<MessageDto>();

  isMyMessage = input<boolean>(false);
}
