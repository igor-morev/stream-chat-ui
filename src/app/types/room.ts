import { UserDto } from "./user";

export interface Room {
  id: string;
  name: string;
  users: UserDto[];
}