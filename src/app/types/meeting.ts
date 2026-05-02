import { SocketEvent } from "./socket-event";
import { UserDto } from "./user";

export interface ActiveMeeting {
  roomId: string;
  host: UserDto;
  type: 'direct' | 'group';
  meetingLink: string;
  status: 'active' | 'inactive';
  createdAt: number;
  onlineUsers: string[];
}

export interface StreamVideoEvent extends SocketEvent<{
  type: 'answer' | 'offer' | 'candidate';
  roomId: string;
  senderId: string;
  targetId: string;
  sdp?: string;
  candidate?: RTCIceCandidate;
}> {
  type: 'video-signal';
}

export interface StreamMeetingGetInfoEvent extends SocketEvent<string> {
  type: 'get_room_info';
}

export interface StreamMeetingInfoResponseEvent extends SocketEvent<ActiveMeeting> {
  type: 'room_info_response';
}

export interface StreamMeetingStartEvent extends SocketEvent<{
  roomId: string;
}> {
  type: 'start_meeting';
}

export interface StreamMeetingJoinEvent extends SocketEvent<{
  roomId: string;
  hostId: string;
}> {
  type: 'join_meeting'
}

export interface StreamMeetingLeaveEvent extends SocketEvent<{
  roomId: string;
}> {
  type: 'leave_meeting'
}

export interface StreamMeetingStopEvent extends SocketEvent<{
  roomId: string;
}> {
  type: 'stop_meeting'
}


export interface StreamMeetingInvitationEvent extends SocketEvent<{
  host: UserDto;
  roomId: string;
  status: 'active' | 'inactive'
}> {
  type: 'meeting_invitation';
}

export interface StreamMeetingUserJoinedEvent extends SocketEvent<{
  user: UserDto;
  roomId: string;
}> {
  type: 'meeting_user_joined';
}

export interface StreamMeetingUserLeftEvent extends SocketEvent<{
  user: UserDto;
  roomId: string;
}> {
  type: 'meeting_user_left';
}


export interface StreamMeetingEndedEvent extends SocketEvent<{
  roomId: string;
}> {
  type: 'meeting_ended';
}