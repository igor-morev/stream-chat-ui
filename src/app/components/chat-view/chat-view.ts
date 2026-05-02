import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { Component, ElementRef, inject, input, PLATFORM_ID, Signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StreamChatApi } from '@app/api/stream-chat-api';
import { AuthService } from '@app/services/auth/auth-service';
import { ChatService } from '@app/services/chat/chat-service';
import { SocketService } from '@app/services/socket/socket-adapter';
import { MessageDto, CreateMessageDto } from '@app/types/chat-message';
import { Observable, of, shareReplay, switchMap } from 'rxjs';
import { ChatEditorToolbar } from "../chat-editor-toolbar/chat-editor-toolbar";
import { ChatMessage } from "../chat-message/chat-message";
import { ChatEditorControl } from "../chat-editor-control/chat-editor-control";
import { CHAT_VIEW_CONTEXT } from './chat-view.token';
import { WebRtcAdapter } from '@app/services/video/web-rtc-adapter';
import { StreamVideoEvent } from '@app/types/meeting';
import { Room } from '@app/types/room';
import { MeetingService } from '@app/services/meeting/meeting-service';

@Component({
  selector: 'sc-chat-view',
  imports: [ChatEditorToolbar, ChatMessage, ChatEditorControl, AsyncPipe],
  templateUrl: './chat-view.html',
  styleUrl: './chat-view.scss',
})
export class ChatView {
  @ViewChild('viewport') viewport?: ElementRef<HTMLDivElement>;

  chatId = input.required<string>();

  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  
  private api = inject(StreamChatApi);
  private chatService = inject(ChatService);
  private socketService = inject(SocketService);
  private meetingService = inject(MeetingService);
  private router = inject(Router);

  chatViewContext = inject(CHAT_VIEW_CONTEXT);
  messages: Signal<MessageDto[]> = this.chatService.messages;
  user = this.authService.user;

  chatId$ = toObservable(this.chatId).pipe(
    shareReplay(1)
  );

  room$: Observable<Room> = of({} as Room);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.room$ = this.chatId$.pipe(
      switchMap((chatId) => this.api.getRoom(chatId))
    );

    this.chatId$.pipe(
      switchMap(roomId => this.api.getMessages(roomId))
    ).subscribe((messages) => {
      this.chatService.loadMessages(messages);

      this.scrollViewportToTop();
    });

    this.chatService.messageAdded.subscribe(() => {
      this.scrollViewportToTop();
    });
  }

  ngAfterViewInit() {
    this.scrollViewportToTop();
  }

  scrollViewportToTop() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.viewport) {
          this.viewport.nativeElement.scrollTo({
            top: this.viewport.nativeElement.scrollHeight,
            behavior: 'instant'
          })
        }
      }, 50)
    }
  }

  sendMessage(value: string) {
    this.socketService.emit<CreateMessageDto>('message', {
      content: value,
      roomId: this.chatId(),
    });
  }

  handleStartMeeting() {
    this.meetingService.startMeeting(this.chatId());
    // this.chatService.getParticipants(this.chatId()).forEach(async (userId) => {
    //   const peerConnection = this.webRtcAdapter.createPeerConnection(userId, {
    //     iceServers: this.webRtcAdapter.servers
    //   });
  
    //   // peerConnection.ontrack = (event) => {
    //   //   // console.log(event)
    //   //   // document.getElementById('remoteVideo').srcObject = event.streams[0];
    //   // };
  
    //   const offer = await peerConnection.createOffer();
    //   await peerConnection.setLocalDescription(offer);
  
    //   this.socketService.emit<StreamVideoEvent['payload']>('video-signal', {
    //     type: 'offer',
    //     senderId: this.authService.user()?.id!,
    //     targetId: userId,
    //     roomId: this.chatId(),
    //     sdp: offer.sdp
    //   });
    // });

    // this.router.navigate(['stream', 'meeting', this.chatId()]);
  }
}
