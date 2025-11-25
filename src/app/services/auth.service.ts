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
    // Cargar usuarios desde localStorage
    this.cargarUsuariosDesdeLocalStorage();
    
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

  // Método para registrar nuevos usuarios (solo clientes)
  registrarUsuario(nombre: string, email: string, password: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      try {
        // Verificar si el email ya existe
        const usuarioExistente = this.users.find(u => u.email === email);
        if (usuarioExistente) {
          observer.next({
            success: false,
            message: 'Este email ya está registrado. Por favor, inicia sesión.'
          });
          observer.complete();
          return;
        }

        // Crear nuevo usuario con rol USUARIO (cliente)
        const nuevoId = this.users.length > 0 
          ? Math.max(...this.users.map(u => u.id)) + 1 
          : 1;

        const nuevoUsuario: User = {
          id: nuevoId,
          email: email,
          password: password,
          nombre: nombre,
          rol: UserRole.USUARIO
        };

        this.users.push(nuevoUsuario);
        this.guardarUsuariosEnLocalStorage();

        observer.next({
          success: true,
          message: 'Cuenta creada exitosamente. Ya puedes iniciar sesión.'
        });
        observer.complete();
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        observer.next({
          success: false,
          message: 'Error al crear la cuenta. Intente nuevamente.'
        });
        observer.complete();
      }
    });
  }

  private guardarUsuariosEnLocalStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('users', JSON.stringify(this.users));
      }
    } catch (error) {
      console.warn('Error al guardar usuarios en localStorage:', error);
    }
  }

  private cargarUsuariosDesdeLocalStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const usuariosGuardados = localStorage.getItem('users');
        if (usuariosGuardados) {
          this.users = JSON.parse(usuariosGuardados);
        }
      }
    } catch (error) {
      console.warn('Error al cargar usuarios desde localStorage:', error);
    }
  }

  // Verificar si un email está disponible
  verificarEmailDisponible(email: string): Observable<boolean> {
    return new Observable(observer => {
      try {
        const usuarioExistente = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        observer.next(!usuarioExistente);
        observer.complete();
      } catch (error) {
        console.error('Error al verificar email:', error);
        observer.next(false);
        observer.complete();
      }
    });
  }

  // Obtener usuario por email
  obtenerUsuarioPorEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // Obtener usuarios por rol
  obtenerUsuariosPorRol(rol: UserRole): User[] {
    return this.users.filter(u => u.rol === rol);
  }

  // Cambiar rol de un usuario
  cambiarRolUsuario(email: string, nuevoRol: UserRole): boolean {
    const usuario = this.obtenerUsuarioPorEmail(email);
    if (usuario) {
      usuario.rol = nuevoRol;
      this.guardarUsuariosEnLocalStorage();
      return true;
    }
    return false;
  }
}

