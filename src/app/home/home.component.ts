import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicioService } from '../services/servicio.service';
import { Servicio } from '../models/servicio.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  serviciosDestacados: Servicio[] = [];

  constructor(private servicioService: ServicioService) {}

  ngOnInit(): void {
    this.servicioService.obtenerServicios().subscribe(servicios => {
      // Mostrar solo los primeros 3 servicios activos como destacados
      this.serviciosDestacados = servicios.filter(s => s.activo).slice(0, 3);
    });
  }
}
