import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ServicioService } from '../services/servicio.service';
import { Servicio } from '../models/servicio.model';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];

  constructor(
    public authService: AuthService, 
    private router: Router,
    private servicioService: ServicioService
  ) {}

  ngOnInit(): void {
    this.servicioService.obtenerServicios().subscribe(servicios => {
      // Solo mostrar servicios activos
      this.servicios = servicios.filter(s => s.activo);
    });
  }

  canReserve(): boolean {
    return this.authService.canReserve();
  }

  isInvitado(): boolean {
    return this.authService.isInvitado();
  }

  reservar(servicio?: string): void {
    // Verificar si el usuario puede reservar (solo usuarios autenticados pueden)
    if (!this.canReserve()) {
      // Mostrar mensaje y redirigir al login
      alert('Para reservar una hora necesitas estar logueado');
      this.router.navigate(['/login']);
      return;
    }

    // Redirigir a la página de reserva con el servicio como parámetro opcional
    if (servicio) {
      this.router.navigate(['/reserva'], { queryParams: { servicio: servicio } });
    } else {
      this.router.navigate(['/reserva']);
    }
  }
}
