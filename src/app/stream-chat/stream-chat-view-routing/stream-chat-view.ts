import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatView } from '@app/components/chat-view/chat-view';
import { map } from 'rxjs';

@Component({
  selector: 'sc-stream-chat-view',
  imports: [ChatView, AsyncPipe],
  templateUrl: './stream-chat-view.html',
  styleUrl: './stream-chat-view.scss',
})
export class StreamChatViewRouting {
  private route = inject(ActivatedRoute);

  chatId$ = this.route.params.pipe(map((params) => params['roomId']));
}
