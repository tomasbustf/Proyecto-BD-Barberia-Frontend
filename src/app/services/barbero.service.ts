import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Barbero } from '../models/barbero.model';

@Injectable({
  providedIn: 'root'
})
export class BarberoService {
  private barberosSubject = new BehaviorSubject<Barbero[]>([]);
  public barberos$ = this.barberosSubject.asObservable();

  // Simulación de base de datos (luego se conectará a una BD real)
  private barberos: Barbero[] = [
    {
      id: 2,
      nombre: 'Juan Barbero',
      email: 'barberobarberia.com',
      telefono: '+56912345678',
      activo: true,
      googleCalendarEmail: ''
    },
    {
      id: 4,
      nombre: 'Carlos Barbero',
      email: 'carlos@barberia.com',
      telefono: '+56987654321',
      activo: true,
      googleCalendarEmail: ''
    },
    {
      id: 5,
      nombre: 'Miguel Barbero',
      email: 'miguel@barberia.com',
      telefono: '+56911223344',
      activo: true,
      googleCalendarEmail: ''
    }
  ];

  constructor() {
    this.cargarDesdeLocalStorage();
    this.barberosSubject.next([...this.barberos]);
  }

  private guardarEnLocalStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('barberos', JSON.stringify(this.barberos));
      }
    } catch (error) {
      console.warn('Error al guardar barberos en localStorage:', error);
    }
  }

  private cargarDesdeLocalStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const barberosGuardados = localStorage.getItem('barberos');
        if (barberosGuardados) {
          this.barberos = JSON.parse(barberosGuardados);
        }
      }
    } catch (error) {
      console.warn('Error al cargar barberos desde localStorage:', error);
    }
  }

  obtenerBarberos(): Observable<Barbero[]> {
    return this.barberos$;
  }

  obtenerBarberosActivos(): Barbero[] {
    return this.barberos.filter(b => b.activo);
  }

  obtenerBarberoPorId(id: number): Barbero | undefined {
    return this.barberos.find(b => b.id === id);
  }

  agregarBarbero(barbero: Omit<Barbero, 'id'>): Barbero {
    const nuevoId = this.barberos.length > 0 
      ? Math.max(...this.barberos.map(b => b.id)) + 1 
      : 1;
    
    const nuevoBarbero: Barbero = {
      ...barbero,
      id: nuevoId
    };
    
    this.barberos.push(nuevoBarbero);
    this.barberosSubject.next([...this.barberos]);
    this.guardarEnLocalStorage();
    
    return nuevoBarbero;
  }

  actualizarBarbero(id: number, barbero: Partial<Barbero>): boolean {
    const index = this.barberos.findIndex(b => b.id === id);
    if (index !== -1) {
      this.barberos[index] = { ...this.barberos[index], ...barbero };
      this.barberosSubject.next([...this.barberos]);
      this.guardarEnLocalStorage();
      return true;
    }
    return false;
  }

  eliminarBarbero(id: number): boolean {
    const index = this.barberos.findIndex(b => b.id === id);
    if (index !== -1) {
      this.barberos.splice(index, 1);
      this.barberosSubject.next([...this.barberos]);
      this.guardarEnLocalStorage();
      return true;
    }
    return false;
  }
}

