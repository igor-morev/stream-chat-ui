import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebRtcAdapter {
  private iceCandidates = new Map<string, Subject<RTCIceCandidate>>();
  private remoteStreams = new Map<string, ReplaySubject<MediaStream>>();
  private connectionStates = new Map<string, Subject<RTCPeerConnectionState>>();
  readonly peerConnections = new Map<string, RTCPeerConnection>();

  readonly servers: RTCIceServer[] = [
    {
      urls: "stun:stun.l.google.com:19302"
    },
    {
      urls: "stun:stun1.l.google.com:19302"
    }
  ];

  createPeerConnection(peerId: string, config: RTCConfiguration): RTCPeerConnection {
    const pc = new RTCPeerConnection(config);

    // 1. Закрываем старое соединение, если оно есть
    if (this.peerConnections.has(peerId)) {
      this.closePeerConnection(peerId);
    }

    this.iceCandidates.set(peerId, new Subject());
    this.remoteStreams.set(peerId, new ReplaySubject(1));
    this.connectionStates.set(peerId, new Subject());

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.iceCandidates.get(peerId)?.next(event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log('пришёл track', event, this.remoteStreams.get(peerId));
      this.remoteStreams.get(peerId)?.next(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      this.connectionStates.get(peerId)?.next(pc.connectionState);
    };

    this.peerConnections.set(peerId, pc);

    return this.peerConnections.get(peerId)!;
  }

  getPeerConnection(peerId: string) {
    return this.peerConnections.get(peerId);
  }

  addTrack(peerConnection: RTCPeerConnection, track: MediaStreamTrack, stream: MediaStream): RTCRtpSender {
    return peerConnection.addTrack(track, stream);
  }

  closePeerConnection(peerId: string): void {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }
  
    // Завершаем стримы перед удалением
    ['iceCandidates', 'remoteStreams', 'connectionStates'].forEach(mapName => {
      const map = (this as any)[mapName] as Map<string, Subject<any>>;
      const subject = map.get(peerId);
      if (subject) {
        subject.complete(); // Оповещаем подписчиков, что данных больше не будет
        map.delete(peerId);
      }
    });
  }

  closeAllConnections() {
    this.peerConnections.forEach((pc, peerId) => {
      pc.close();
      console.log(`Соединение с ${peerId} закрыто`);

      ['iceCandidates', 'remoteStreams', 'connectionStates'].forEach(mapName => {
        const map = (this as any)[mapName] as Map<string, Subject<any>>;
        const subject = map.get(peerId);
        if (subject) {
          subject.complete(); // Оповещаем подписчиков, что данных больше не будет
          map.delete(peerId);
        }
      });
    });
    this.peerConnections.clear();
    // Очистите также другие Map, если они есть (стримы, кандидаты)
    // Завершаем стримы перед удалением
  
  }

  getIceCandidates$(peerId: string) {
    return this.iceCandidates.get(peerId)?.asObservable();
  }

  getRemoteStream$(peerId: string) {
    return this.remoteStreams.get(peerId)?.asObservable();
  }

  getConnectionState$(peerId: string) {
    return this.connectionStates.get(peerId)?.asObservable();
  }

  // ...existing methods...
}