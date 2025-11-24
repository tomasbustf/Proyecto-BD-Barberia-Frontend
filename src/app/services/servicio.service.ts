import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private serviciosSubject = new BehaviorSubject<Servicio[]>([]);
  public servicios$ = this.serviciosSubject.asObservable();

  // Simulación de base de datos (luego se conectará a una BD real)
  private servicios: Servicio[] = [
    {
      id: 1,
      nombre: 'Corte de Cabello',
      descripcion: 'Corte moderno y estilizado',
      precio: 15000,
      duracion: 30,
      activo: true
    },
    {
      id: 2,
      nombre: 'Barba',
      descripcion: 'Arreglo y diseño de barba',
      precio: 10000,
      duracion: 20,
      activo: true
    }
  ];

  constructor() {
    this.cargarDesdeLocalStorage();
    this.serviciosSubject.next([...this.servicios]);
  }

  private guardarEnLocalStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('servicios', JSON.stringify(this.servicios));
      }
    } catch (error) {
      console.warn('Error al guardar servicios en localStorage:', error);
    }
  }

  private cargarDesdeLocalStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const serviciosGuardados = localStorage.getItem('servicios');
        if (serviciosGuardados) {
          this.servicios = JSON.parse(serviciosGuardados);
        }
      }
    } catch (error) {
      console.warn('Error al cargar servicios desde localStorage:', error);
    }
  }

  obtenerServicios(): Observable<Servicio[]> {
    return this.servicios$;
  }

  obtenerServiciosActivos(): Servicio[] {
    return this.servicios.filter(s => s.activo);
  }

  obtenerServicioPorId(id: number): Servicio | undefined {
    return this.servicios.find(s => s.id === id);
  }

  agregarServicio(servicio: Omit<Servicio, 'id'>): Servicio {
    const nuevoId = this.servicios.length > 0 
      ? Math.max(...this.servicios.map(s => s.id)) + 1 
      : 1;
    
    const nuevoServicio: Servicio = {
      ...servicio,
      id: nuevoId
    };
    
    this.servicios.push(nuevoServicio);
    this.serviciosSubject.next([...this.servicios]);
    this.guardarEnLocalStorage();
    
    return nuevoServicio;
  }

  actualizarServicio(id: number, servicio: Partial<Servicio>): boolean {
    const index = this.servicios.findIndex(s => s.id === id);
    if (index !== -1) {
      this.servicios[index] = { ...this.servicios[index], ...servicio };
      this.serviciosSubject.next([...this.servicios]);
      this.guardarEnLocalStorage();
      return true;
    }
    return false;
  }

  eliminarServicio(id: number): boolean {
    const index = this.servicios.findIndex(s => s.id === id);
    if (index !== -1) {
      this.servicios.splice(index, 1);
      this.serviciosSubject.next([...this.servicios]);
      this.guardarEnLocalStorage();
      return true;
    }
    return false;
  }
}

