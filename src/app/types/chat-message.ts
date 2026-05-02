import { SocketEvent } from "./socket-event";
import { UserDto } from "./user";

export interface MessageDto {
  id: string;
  content: string;
  sender: UserDto;
  createdAt: string;
  updatedAt: string;
  roomId: string;
}

export interface CreateMessageDto {
  roomId: string;
  content: string;
}
export interface StreamChatEvent extends SocketEvent<{
  sender: string;
  content: string;
  roomId: string;
}> {
  type: 'message';
}