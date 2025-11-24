import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ProductoService } from '../services/producto.service';
import { ServicioService } from '../services/servicio.service';
import { BarberoService } from '../services/barbero.service';
import { Producto } from '../models/producto.model';
import { Servicio } from '../models/servicio.model';
import { Barbero } from '../models/barbero.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  activeTab: 'servicios' | 'barberos' | 'productos' = 'servicios';

  servicios: Servicio[] = [];
  barberos: Barbero[] = [];

  nuevoServicio: Omit<Servicio, 'id'> = {
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: 0,
    activo: true
  };

  nuevoBarbero: Omit<Barbero, 'id'> = {
    nombre: '',
    email: '',
    telefono: '',
    activo: true,
    googleCalendarEmail: ''
  };

  productos: Producto[] = [];
  nuevoProducto: Omit<Producto, 'id'> = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    activo: true
  };

  constructor(
    public authService: AuthService,
    private productoService: ProductoService,
    private servicioService: ServicioService,
    private barberoService: BarberoService
  ) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.productos = productos;
    });

    this.servicioService.obtenerServicios().subscribe(servicios => {
      this.servicios = servicios;
    });

    this.barberoService.obtenerBarberos().subscribe(barberos => {
      this.barberos = barberos;
    });
  }

  setActiveTab(tab: 'servicios' | 'barberos' | 'productos'): void {
    this.activeTab = tab;
  }

  agregarServicio(): void {
    if (this.nuevoServicio.nombre && this.nuevoServicio.descripcion) {
      this.servicioService.agregarServicio(this.nuevoServicio);
      this.nuevoServicio = {
        nombre: '',
        descripcion: '',
        precio: 0,
        duracion: 0,
        activo: true
      };
      alert('Servicio agregado correctamente');
    }
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Está seguro de eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id);
      alert('Servicio eliminado correctamente');
    }
  }

  toggleServicioActivo(servicio: Servicio): void {
    this.servicioService.actualizarServicio(servicio.id, { activo: !servicio.activo });
  }

  agregarBarbero(): void {
    if (this.nuevoBarbero.nombre && this.nuevoBarbero.email) {
      this.barberoService.agregarBarbero(this.nuevoBarbero);
      this.nuevoBarbero = {
        nombre: '',
        email: '',
        telefono: '',
        activo: true,
        googleCalendarEmail: ''
      };
      alert('Barbero agregado correctamente');
    }
  }

  eliminarBarbero(id: number): void {
    if (confirm('¿Está seguro de eliminar este barbero?')) {
      this.barberoService.eliminarBarbero(id);
      alert('Barbero eliminado correctamente');
    }
  }

  toggleBarberoActivo(barbero: Barbero): void {
    this.barberoService.actualizarBarbero(barbero.id, { activo: !barbero.activo });
  }

  agregarProducto(): void {
    if (this.nuevoProducto.nombre && this.nuevoProducto.descripcion) {
      this.productoService.agregarProducto(this.nuevoProducto);
      this.nuevoProducto = {
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        activo: true
      };
      alert('Producto agregado correctamente');
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id);
      alert('Producto eliminado correctamente');
    }
  }

  toggleProductoActivo(producto: Producto): void {
    this.productoService.actualizarProducto(producto.id, { activo: !producto.activo });
  }
}
