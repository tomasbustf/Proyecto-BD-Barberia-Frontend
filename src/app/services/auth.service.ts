import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole, LoginCredentials } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Simulación de base de datos (luego se conectará a una BD real)
  private users: User[] = [
    {
      id: 1,
      email: 'adminbarberia.com',
      password: 'admin123',
      nombre: 'Administrador',
      rol: UserRole.ADMIN
    },
    {
      id: 2,
      email: 'barberobarberia.com',
      password: 'barbero123',
      nombre: 'Juan Barbero',
      rol: UserRole.BARBERO
    },
    {
      id: 3,
      email: 'usuariobarberia.com',
      password: 'usuario123',
      nombre: 'Pedro Usuario',
      rol: UserRole.USUARIO
    }
  ];

  constructor() {
    // Verificar si hay un usuario guardado en localStorage de forma segura
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          this.currentUserSubject.next(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.warn('Error al cargar usuario desde localStorage:', error);
    }
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return new Observable(observer => {
      try {
        const user = this.users.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          // Eliminar password antes de guardar
          const { password, ...userWithoutPassword } = user;
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          }
          this.currentUserSubject.next(userWithoutPassword as User);
          observer.next(true);
        } else {
          observer.next(false);
        }
      } catch (error) {
        console.error('Error en login:', error);
        observer.next(false);
      }
      observer.complete();
    });
  }

  loginAsGuest(): void {
    const guestUser: User = {
      id: 0,
      email: 'invitado@barberia.com',
      password: '',
      nombre: 'Invitado',
      rol: UserRole.INVITADO
    };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('currentUser', JSON.stringify(guestUser));
      }
      this.currentUserSubject.next(guestUser);
    } catch (error) {
      console.error('Error al guardar invitado:', error);
    }
  }

  logout(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('currentUser');
      }
      this.currentUserSubject.next(null);
    } catch (error) {
      console.error('Error en logout:', error);
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isBarbero(): boolean {
    return this.hasRole(UserRole.BARBERO);
  }

  isUsuario(): boolean {
    return this.hasRole(UserRole.USUARIO);
  }

  isInvitado(): boolean {
    return this.hasRole(UserRole.INVITADO);
  }

  canReserve(): boolean {
    const user = this.currentUserSubject.value;
    return user?.rol === UserRole.USUARIO;
  }
}

