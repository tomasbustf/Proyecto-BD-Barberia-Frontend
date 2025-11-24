import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

interface Reserva {
  id: number;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
}

@Component({
  selector: 'app-barbero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barbero.component.html',
  styleUrl: './barbero.component.css'
})
export class BarberoComponent {
  reservas: Reserva[] = [
    {
      id: 1,
      cliente: 'Pedro Usuario',
      servicio: 'Corte de Cabello',
      fecha: '2024-01-15',
      hora: '10:00',
      estado: 'confirmada'
    },
    {
      id: 2,
      cliente: 'María González',
      servicio: 'Barba',
      fecha: '2024-01-15',
      hora: '11:30',
      estado: 'pendiente'
    },
    {
      id: 3,
      cliente: 'Juan Pérez',
      servicio: 'Corte de Cabello',
      fecha: '2024-01-16',
      hora: '09:00',
      estado: 'confirmada'
    }
  ];

  constructor(public authService: AuthService) {}

  cambiarEstado(reservaId: number, nuevoEstado: Reserva['estado']): void {
    const reserva = this.reservas.find(r => r.id === reservaId);
    if (reserva) {
      reserva.estado = nuevoEstado;
    }
  }

  getEstadoClass(estado: string): string {
    const estados: { [key: string]: string } = {
      'pendiente': 'estado-pendiente',
      'confirmada': 'estado-confirmada',
      'completada': 'estado-completada',
      'cancelada': 'estado-cancelada'
    };
    return estados[estado] || '';
  }
}
