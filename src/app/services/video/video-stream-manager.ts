import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoStreamManager {
  private localStream: MediaStream | null = null;
  private remoteStreams = new Map<string, MediaStream>();
  private localStreamSubject = new Subject<MediaStream>();
  private remoteStreamSubject = new Subject<{ peerId: string; stream: MediaStream }>();

  async initializeLocalStream(constraints: MediaStreamConstraints = { audio: true, video: true }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStreamSubject.next(this.localStream);
      return this.localStream;
    } catch (error) {
      console.error('Failed to get user media:', error);
      throw error;
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getLocalStream$(): Observable<MediaStream> {
    return this.localStreamSubject.asObservable();
  }

  addRemoteStream(peerId: string, stream: MediaStream): void {
    this.remoteStreams.set(peerId, stream);
    this.remoteStreamSubject.next({ peerId, stream });
  }

  getRemoteStream(peerId: string): MediaStream | null {
    return this.remoteStreams.get(peerId) || null;
  }

  getRemoteStream$(): Observable<{ peerId: string; stream: MediaStream }> {
    return this.remoteStreamSubject.asObservable();
  }

  stopLocalStream(): void {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.localStream = null;
  }

  stopRemoteStream(peerId: string): void {
    const stream = this.remoteStreams.get(peerId);
    stream?.getTracks().forEach(track => track.stop());
    this.remoteStreams.delete(peerId);
  }

  toggleAudio(enabled: boolean): void {
    this.localStream?.getAudioTracks().forEach(track => track.enabled = enabled);
  }

  toggleVideo(enabled: boolean): void {
    this.localStream?.getVideoTracks().forEach(track => track.enabled = enabled);
  }
}