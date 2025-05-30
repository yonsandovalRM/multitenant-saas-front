export const enum Role {
  ADMIN = 'admin',
  USER = 'user',
  PROFESSIONAL = 'professional',
}
export interface User {
  name: string;
  email: string;
  password: string;
  role: Role;
}
