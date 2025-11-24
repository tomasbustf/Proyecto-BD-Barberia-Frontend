import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
}

interface Barbero {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  activeTab: 'servicios' | 'barberos' = 'servicios';

  servicios: Servicio[] = [
    { id: 1, nombre: 'Corte de Cabello', descripcion: 'Corte moderno y estilizado', precio: 15000, duracion: 30 },
    { id: 2, nombre: 'Barba', descripcion: 'Arreglo y diseño de barba', precio: 10000, duracion: 20 }
  ];

  barberos: Barbero[] = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@barberia.com', telefono: '+56912345678' },
    { id: 2, nombre: 'Carlos García', email: 'carlos@barberia.com', telefono: '+56987654321' }
  ];

  nuevoServicio: Servicio = {
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: 0
  };

  nuevoBarbero: Barbero = {
    id: 0,
    nombre: '',
    email: '',
    telefono: ''
  };

  constructor(public authService: AuthService) {}

  setActiveTab(tab: 'servicios' | 'barberos'): void {
    this.activeTab = tab;
  }

  agregarServicio(): void {
    if (this.nuevoServicio.nombre && this.nuevoServicio.descripcion) {
      this.nuevoServicio.id = this.servicios.length + 1;
      this.servicios.push({ ...this.nuevoServicio });
      this.nuevoServicio = { id: 0, nombre: '', descripcion: '', precio: 0, duracion: 0 };
      alert('Servicio agregado correctamente');
    }
  }

  eliminarServicio(id: number): void {
    this.servicios = this.servicios.filter(s => s.id !== id);
  }

  agregarBarbero(): void {
    if (this.nuevoBarbero.nombre && this.nuevoBarbero.email) {
      this.nuevoBarbero.id = this.barberos.length + 1;
      this.barberos.push({ ...this.nuevoBarbero });
      this.nuevoBarbero = { id: 0, nombre: '', email: '', telefono: '' };
      alert('Barbero agregado correctamente');
    }
  }

  eliminarBarbero(id: number): void {
    this.barberos = this.barberos.filter(b => b.id !== id);
  }
}
