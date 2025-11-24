export enum UserRole {
  ADMIN = 'admin',
  BARBERO = 'barbero',
  USUARIO = 'usuario',
  INVITADO = 'invitado'
}

export interface User {
  id: number;
  email: string;
  password: string;
  nombre: string;
  rol: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

