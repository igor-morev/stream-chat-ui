import { inject, Injectable } from '@angular/core';
import { WebRtcAdapter } from '../video/web-rtc-adapter';
import { SocketService } from '../socket/socket-adapter';
import { StreamMeetingEndedEvent, StreamMeetingInfoResponseEvent, StreamMeetingInvitationEvent, StreamMeetingJoinEvent, StreamMeetingStartEvent, StreamMeetingUserJoinedEvent, StreamMeetingUserLeftEvent, StreamVideoEvent } from '@app/types/meeting';
import { AuthService } from '../auth/auth-service';
import { Router } from '@angular/router';
import { filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private authService = inject(AuthService);
  private webRtcAdapter = inject(WebRtcAdapter);
  private socketService = inject(SocketService);

  private router = inject(Router);

  meetingInvitation$ = this.socketService.on<StreamMeetingInvitationEvent['payload']>('meeting_invitation').pipe(
    tap((data) => {
      console.log('meetingInvitation', data);
    })
  );
  meetingUserJoined$ = this.socketService.on<StreamMeetingUserJoinedEvent['payload']>('meeting_user_joined');

  offerRequest$ = this.socketService.on<StreamVideoEvent['payload']>('video-signal').pipe(
    filter((data) => data.type === 'offer'),
    tap((data) => {
      console.log('offerRequest', data);
    })
  );

  meetingUserLeft$ = this.socketService.on<StreamMeetingUserLeftEvent['payload']>('meeting_user_left');
  meetingEnded$ = this.socketService.on<StreamMeetingEndedEvent['payload']>('meeting_ended');

  constructor() {
    this.setupListeners();
  }

  setupListeners() {
    this.socketService.on<StreamVideoEvent['payload']>('video-signal').subscribe(async (data) => {
      const peerConnection = this.webRtcAdapter.getPeerConnection(data.senderId);

      if (data.type === 'answer') {
        await peerConnection?.setRemoteDescription(new RTCSessionDescription(data as RTCSessionDescriptionInit))
      } else if (data.type === 'candidate') {
        // ICE кандидаты добавляем только если RemoteDescription уже установлен
        if (peerConnection?.remoteDescription && data.candidate) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      }
    });
  }

  startMeeting(roomId: string) {
    this.socketService.emit<StreamMeetingStartEvent['payload']>('start_meeting', {
      roomId
    });

    this.router.navigate(['stream', 'meeting', roomId]);
  }

  joinMeeting(roomId: string, hostId: string) {
    console.log('Отправляем событие join_meeting');
    this.socketService.emit<StreamMeetingJoinEvent['payload']>('join_meeting', {
      roomId,
      hostId
    });
  }

  getRoomInfo(roomId: string) {
    // Отправляем запрос на бэкенд (тот самый @SubscribeMessage('get_room_info'))
    this.socketService.emit('get_room_info', { roomId });
  
    // Ждем разового ответа от сервера
    return this.socketService.on<StreamMeetingInfoResponseEvent['payload']>('room_info_response');
  }

  closeConnection(userId: string) {
    this.webRtcAdapter.closePeerConnection(userId);
  }

  closeAllConnections() {
    this.webRtcAdapter.closeAllConnections();
  }

  leaveMeeting(roomId: string) {    
    this.webRtcAdapter.closeAllConnections();

    this.socketService.emit<StreamMeetingStartEvent['payload']>('leave_meeting', {
      roomId
    });

    this.router.navigate(['stream', 'chat', roomId]);
  }

  stopMeeting(roomId: string) {    
    this.webRtcAdapter.closeAllConnections();

    this.socketService.emit<StreamMeetingStartEvent['payload']>('stop_meeting', {
      roomId
    });

    this.router.navigate(['stream', 'chat', roomId]);
  }

  getRemoteStream(peerId: string) {
    return this.webRtcAdapter.getRemoteStream$(peerId);
  }

  async createOffer(chatId: string, targetId: string, localStream: MediaStream) {
    const peerConnection = this.webRtcAdapter.createPeerConnection(targetId, {
      iceServers: this.webRtcAdapter.servers
    });

    this.webRtcAdapter.getIceCandidates$(targetId)?.subscribe((candidate) => {
      this.socketService.emit<StreamVideoEvent['payload']>('video-signal', {
        type: 'candidate',
        roomId: chatId,
        senderId: this.authService.user()?.id!,
        targetId,
        candidate
      });
    });

    localStream.getTracks().forEach(track => {
      this.webRtcAdapter.addTrack(peerConnection, track, localStream);
    });

    // peerConnection.ontrack = (event) => {
    //   // console.log(event)
    //   // document.getElementById('remoteVideo').srcObject = event.streams[0];
    // };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    this.socketService.emit<StreamVideoEvent['payload']>('video-signal', {
      type: 'offer',
      senderId: this.authService.user()?.id!,
      targetId,
      roomId: chatId,
      sdp: offer.sdp
    });
  }

  async createAnswer(data: StreamVideoEvent['payload'], localStream: MediaStream) {
    const peerConnection = this.webRtcAdapter.createPeerConnection(data.senderId, {
      iceServers: this.webRtcAdapter.servers
    });

    this.webRtcAdapter.getIceCandidates$(data.senderId)?.subscribe((candidate) => {
      this.socketService.emit<StreamVideoEvent['payload']>('video-signal', {
        type: 'candidate',
        roomId: data.roomId,
        senderId: this.authService.user()?.id!,
        targetId: data.senderId,
        candidate
      });
    });

    // this.webRtcAdapter.getRemoteStream$(data.senderId)?.subscribe((remoteStream) => {
    //   // Привяжите этот remoteStream к <video> элементу в UI
    //   this.remoteStream = remoteStream; 
    // });

    // 3. Добавляем треки (теперь они у нас есть!)
    localStream.getTracks().forEach(track => {
      this.webRtcAdapter.addTrack(peerConnection, track, localStream);
    });

    await peerConnection.setRemoteDescription(new RTCSessionDescription({
      type: 'offer',
      sdp: data.sdp
    }));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    this.socketService.emit('video-signal', {
      type: 'answer',
      roomId: data.roomId,
      senderId: this.authService.user()?.id!,
      targetId: data.senderId,
      sdp: answer.sdp
    });
  }
}
