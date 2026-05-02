import { ChangeDetectorRef, Component, DestroyRef, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { MeetingView } from '@app/components/meeting-view/meeting-view';
import { MeetingToolbar } from '@app/components/meeting-toolbar/meeting-toolbar';
import { MeetingLayout } from "@app/components/meeting-layout/meeting-layout";
import { ChatView } from "@app/components/chat-view/chat-view";
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from '@app/services/meeting/meeting-service';
import { filter, map, Observable, takeUntil, tap } from 'rxjs';
import { StreamChatApi } from '@app/api/stream-chat-api';
import { AuthService } from '@app/services/auth/auth-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActiveMeeting } from '@app/types/meeting';

@Component({
  selector: 'sc-stream-chat-meeting',
  imports: [AsyncPipe, MeetingLayout, MeetingToolbar, MeetingView, MeetingLayout, ChatView],
  templateUrl: './stream-chat-meeting.html',
  styleUrl: './stream-chat-meeting.scss',
})
export class StreamChatMeeting implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private api = inject(StreamChatApi);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private meetingService = inject(MeetingService);
  private platformId = inject(PLATFORM_ID);

  meetingId = this.route.snapshot.paramMap.get('meetingId')!;
  isAsidePanelVisible = signal(true);
  localStream: MediaStream | null = null;

  meetingUserJoined$ = this.meetingService.meetingUserJoined$;
  offerRequest$ = this.meetingService.offerRequest$;
  meetingUserLeft$ = this.meetingService.meetingUserLeft$;
  meetingEnded$ = this.meetingService.meetingEnded$;

  isAudioOn = signal(false);
  isCameraOn = signal(true);

  public remoteStreams: { userId: string, stream: MediaStream }[] = [];

  async createLocalVideo() {
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    this.localStream?.getVideoTracks().forEach(track => {
      track.enabled = this.isCameraOn();
    });

  }

  meetingInfo$?: Observable<ActiveMeeting>;

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
  
    // 1. Сначала железно получаем локальное видео
    await this.createLocalVideo();
  
    // 2. Настраиваем слушателей событий WebRTC
    this.setupWebRTCSubscriptions();
  
    // 3. Запрашиваем инфо о комнате
    this.meetingInfo$ = this.meetingService.getRoomInfo(this.meetingId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).pipe(
      map((meetingInfo) => meetingInfo),
      tap(async (meetingInfo) => {
        if (meetingInfo && meetingInfo.status === 'active') {
          const currentUserId = this.authService.userId();
      
      // Находим всех, кто уже в сети (кроме меня)
      const onlinePeers = meetingInfo.onlineUsers?.filter(id => id !== currentUserId) || [];

      if (onlinePeers.length > 0) {
        console.log('Участники в сети найдены:', onlinePeers);

        // ЦИКЛ ПО ВСЕМ УЧАСТНИКАМ
        for (const peerId of onlinePeers) {
          // Если я Хост, я проявляю инициативу и сразу кидаю Offer (важно при F5)
          const isHost = meetingInfo.host.id === currentUserId;
          
          if (isHost) {
            console.log(`Я хост, создаю Offer для ${peerId}`);
            await this.meetingService.createOffer(this.meetingId, peerId, this.localStream!);
            this.subscribeToRemoteStream(peerId);
          } else {
            // Если я Гость, я уведомляю КАЖДОГО о своем присутствии
            // (включая хоста и других гостей)
            console.log(`Я гость, уведомляю участника ${peerId} о входе`);
            this.meetingService.joinMeeting(this.meetingId, peerId);
          }
        }
          }
      }})
    )
  
    this.cdr.markForCheck();
  }
  
  // Выносим подписки в отдельный метод для чистоты
  private setupWebRTCSubscriptions() {
    // Обработка входящих офферов (для Гостей)
    this.offerRequest$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (offer) => {
      await this.meetingService.createAnswer(offer, this.localStream!);
      this.subscribeToRemoteStream(offer.senderId);
    });
  
    // Обработка новых участников (для Хоста)
    this.meetingUserJoined$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (data) => {
      const pId = data.user.id;
      await this.meetingService.createOffer(data.roomId, pId, this.localStream!);
      this.subscribeToRemoteStream(pId);
    });
  
    // Обработка выхода
    this.meetingUserLeft$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.removeRemoteStream(data.user.id);
    });
  
    // Завершение звонка
    this.meetingEnded$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.exitMeeting();
    });
  }
  
  // Универсальный метод подписки на видео
  private subscribeToRemoteStream(userId: string) {
    this.meetingService.getRemoteStream(userId)?.pipe(
      takeUntilDestroyed(this.destroyRef),
      // Фильтруем: закрываем подписку только если вышел ИМЕННО этот пользователь
      takeUntil(this.meetingUserLeft$.pipe(
        filter(data => data.user.id === userId)
      ))
    ).subscribe(stream => {
      const index = this.remoteStreams.findIndex(s => s.userId === userId);
      if (index > -1) {
        // Важно: в Safari иногда нужно перепривязать srcObject, 
        // поэтому простое обновление свойства оправдано
        this.remoteStreams[index].stream = stream;
      } else {
        this.remoteStreams.push({ userId, stream });
      }
      this.cdr.markForCheck();
    });
  }
  
  private removeRemoteStream(userId: string) {
    this.meetingService.closeConnection(userId);
    this.remoteStreams = this.remoteStreams.filter(s => s.userId !== userId);
    this.cdr.markForCheck();
  }

  // Обработка кнопки "Положить трубку"
  handleLeaveMeeting(meetingInfo: ActiveMeeting) {
    if (meetingInfo.host.id === this.authService.userId()) {
      // Если хост — спрашиваем: выйти самому или закрыть для всех?
      const terminateAll = confirm('Завершить звонок для всех участников?');
      if (terminateAll) {
        // this.meetingService.stopMeeting(this.meetingId);
        this.meetingService.stopMeeting(this.meetingId);
      } else {
        this.exitMeeting();
      }
    } else {
      // Если обычный участник — просто выходим
      this.exitMeeting();
    }

  }

  handleToggleChat() {
    this.isAsidePanelVisible.set(!this.isAsidePanelVisible());
  }

  handleToggleCamera() {
    this.isCameraOn.set(!this.isCameraOn());
    
    this.localStream?.getVideoTracks().forEach(track => {
      track.enabled = this.isCameraOn();
    });

    this.cdr.markForCheck();
  }

  handleToggleAudio() {
    this.isAudioOn.set(!this.isAudioOn())

    this.localStream?.getAudioTracks().forEach(track => {
      track.enabled = this.isAudioOn();
    });

    this.cdr.markForCheck();
  }

  stopLocalStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop(); // Полностью выключает девайс
      });
      this.localStream = null;
    }

    this.remoteStreams = [];

    this.cdr.markForCheck();
  }

  exitMeeting() {
    this.meetingService.leaveMeeting(this.meetingId);
    this.stopLocalStream();
  }

  ngOnDestroy() {
    this.exitMeeting();
  }
}
