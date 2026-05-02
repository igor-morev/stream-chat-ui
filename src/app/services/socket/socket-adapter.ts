import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SocketEvent, SocketEventType } from '@app/types/socket-event';

interface SocketAdapter {
  emit<T>(type: SocketEvent<T>['type'], payload: SocketEvent<T>['payload']): void;
  on<T>(type: SocketEventType): Observable<T>;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService implements SocketAdapter {
  private PLATFORM_ID = inject(PLATFORM_ID);
  private socket?: WebSocket;
  // A single subject to emit all incoming socket events
  private socketEvents = new Subject<SocketEvent<unknown>>();

  initialize(url: string) {
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
      console.log('Received clean WS message:', event);
      const data = JSON.parse(event.data);
      this.socketEvents.next({
        type: data.event as SocketEventType,
        payload: data.payload,
      });
    };
    
    this.socket.onopen = () => console.log('Connected:');
    this.socket.onerror = (error) => console.error('WS error:', error);
    this.socket.onclose = () => console.log('WebSocket closed');
  }

  // Generic send method for both chat and video signaling
  emit<T>(type: SocketEvent<T>['type'], payload: SocketEvent<T>['payload']): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket?.send(JSON.stringify({ event: type, data: payload }));
    }
  }

  // Listen for specific event types (e.g., 'chat' or 'video-signal')
  on<T>(type: SocketEventType): Observable<T> {
    return new Observable(observer => {
      this.socketEvents.subscribe(event => {
        if (event.type === type) observer.next(event.payload as T);
      });
    });
  }

  disconnect() {
    this.socket?.close();
  }
}
