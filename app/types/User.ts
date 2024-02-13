export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  avatarInitials: string;
  avatarColor: AvatarColor;
  createdAt: string;
  updatedAt: string;
}

export type Role = 'ADMIN' | 'USER';

export type AvatarColor =
  | 'tomato'
  | 'red'
  | 'ruby'
  | 'crimson'
  | 'pink'
  | 'plum'
  | 'purple'
  | 'violet'
  | 'iris'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'jade'
  | 'green'
  | 'grass'
  | 'brown'
  | 'orange'
  | 'sky'
  | 'mint'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'gold'
  | 'bronze'
  | 'gray';
