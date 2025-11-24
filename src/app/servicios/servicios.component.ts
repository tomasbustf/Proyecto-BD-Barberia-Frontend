import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  constructor(public authService: AuthService, private router: Router) {}

  canReserve(): boolean {
    return this.authService.canReserve();
  }

  isInvitado(): boolean {
    return this.authService.isInvitado();
  }

  reservar(): void {
    // Verificar si el usuario puede reservar (solo usuarios autenticados pueden)
    if (!this.canReserve()) {
      // Mostrar mensaje y redirigir al login
      alert('Para reservar una hora necesitas estar logueado');
      this.router.navigate(['/login']);
      return;
    }

    // Aquí se implementará la lógica de reserva cuando se conecte a la BD
    alert('Funcionalidad de reserva próximamente disponible');
  }
}
