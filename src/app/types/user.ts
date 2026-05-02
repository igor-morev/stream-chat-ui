export interface UserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  status?: 'active' | 'inactive';
  username: string;
}

export interface UserDetails {
  sub: string;
  username: string;
}
  