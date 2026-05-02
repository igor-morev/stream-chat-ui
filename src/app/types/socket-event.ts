export type SocketEventType = 'message' | 'typing' | 'presence' 

| 'video-signal' 
| 'meeting_invitation' | 'start_meeting' | 'leave_meeting' | 'join_meeting' | 'meeting_user_joined' | 'meeting_user_left'
| 'stop_meeting' | 'meeting_ended'
| 'get_room_info' | 'room_info_response';

export interface SocketEvent<T> {
  type: SocketEventType;
  payload: T;
}