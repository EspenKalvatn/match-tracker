export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

type Role = 'ADMIN' | 'USER';
