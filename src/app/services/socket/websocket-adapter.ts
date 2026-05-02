import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, of } from 'rxjs';

export interface WsMessage {
  event: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketAdapter {
  private connections = new Map<string, WebSocket>();
  private messageSubjects = new Map<string, Subject<WsMessage>>();

  createWebSocket(url: string, id: string = 'default'): Observable<WsMessage> {
    const ws = new WebSocket(url);
    const subject = new Subject<WsMessage>();

    ws.onopen = () => console.log('Connected:', id);
    
    ws.onmessage = (event) => {
      console.log(event);
      subject.next(JSON.parse(event.data));
    };
    
    ws.onerror = (error) => console.error('WS error:', error);
    ws.onclose = () => {
      this.connections.delete(id);
      this.messageSubjects.delete(id);
    };

    this.connections.set(id, ws);
    this.messageSubjects.set(id, subject);

    return subject.asObservable();
  }

  send(id: string, data: WsMessage): void {
    const ws = this.connections.get(id);

    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  close(id: string): void {
    this.connections.get(id)?.close();
  }
}