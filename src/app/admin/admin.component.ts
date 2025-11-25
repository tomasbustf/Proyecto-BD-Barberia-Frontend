import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ProductoService } from '../services/producto.service';
import { ServicioService } from '../services/servicio.service';
import { BarberoService } from '../services/barbero.service';
import { PromocionService } from '../services/promocion.service';
import { Producto } from '../models/producto.model';
import { Servicio } from '../models/servicio.model';
import { Barbero } from '../models/barbero.model';
import { Promocion } from '../models/promocion.model';
import { User, UserRole } from '../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  activeTab: 'servicios' | 'barberos' | 'productos' | 'promociones' = 'servicios';

  servicios: Servicio[] = [];
  barberos: Barbero[] = [];
  promociones: Promocion[] = [];
  usuariosDisponibles: User[] = [];

  nuevoServicio: Omit<Servicio, 'id'> = {
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: 30, // Duración fija para todos los servicios
    activo: true
  };

  nuevoBarbero: Omit<Barbero, 'id'> = {
    nombre: '',
    email: '',
    telefono: '',
    activo: true,
    googleCalendarEmail: ''
  };

  emailBusquedaBarbero: string = '';
  usuarioEncontrado: User | null = null;
  mensajeBusquedaBarbero: string = '';

  productos: Producto[] = [];
  nuevoProducto: Omit<Producto, 'id'> = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    activo: true
  };

  nuevaPromocion: Omit<Promocion, 'id'> = {
    servicioId: 0,
    productoId: null,
    porcentajeDescuento: 0,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    activa: true
  };

  constructor(
    public authService: AuthService,
    private productoService: ProductoService,
    private servicioService: ServicioService,
    private barberoService: BarberoService,
    private promocionService: PromocionService
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

    this.promocionService.obtenerPromociones().subscribe(promociones => {
      this.promociones = promociones;
    });

    // Cargar usuarios disponibles (solo clientes)
    this.usuariosDisponibles = this.authService.obtenerUsuariosPorRol(UserRole.USUARIO);
  }

  setActiveTab(tab: 'servicios' | 'barberos' | 'productos' | 'promociones'): void {
    this.activeTab = tab;
  }

  agregarServicio(): void {
    if (this.nuevoServicio.nombre && this.nuevoServicio.descripcion) {
      // Duración fija de 30 minutos para todos los servicios
      this.servicioService.agregarServicio({
        ...this.nuevoServicio,
        duracion: 30
      });
      this.nuevoServicio = {
        nombre: '',
        descripcion: '',
        precio: 0,
        duracion: 30,
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

  buscarUsuarioParaBarbero(): void {
    if (!this.emailBusquedaBarbero) {
      this.mensajeBusquedaBarbero = 'Por favor ingrese un email';
      this.usuarioEncontrado = null;
      return;
    }

    const usuario = this.authService.obtenerUsuarioPorEmail(this.emailBusquedaBarbero);
    
    if (!usuario) {
      this.mensajeBusquedaBarbero = 'No se encontró ningún usuario con ese email. El usuario debe registrarse primero.';
      this.usuarioEncontrado = null;
      return;
    }

    if (usuario.rol === UserRole.BARBERO) {
      this.mensajeBusquedaBarbero = 'Este usuario ya es un barbero.';
      this.usuarioEncontrado = null;
      return;
    }

    if (usuario.rol !== UserRole.USUARIO) {
      this.mensajeBusquedaBarbero = 'Solo se pueden convertir usuarios (clientes) en barberos.';
      this.usuarioEncontrado = null;
      return;
    }

    // Verificar si ya existe como barbero
    const barberoExistente = this.barberos.find(b => b.email.toLowerCase() === usuario.email.toLowerCase());
    if (barberoExistente) {
      this.mensajeBusquedaBarbero = 'Este usuario ya está registrado como barbero.';
      this.usuarioEncontrado = null;
      return;
    }

    this.usuarioEncontrado = usuario;
    this.nuevoBarbero.nombre = usuario.nombre;
    this.nuevoBarbero.email = usuario.email;
    this.mensajeBusquedaBarbero = 'Usuario encontrado. Complete los datos adicionales.';
  }

  agregarBarbero(): void {
    if (!this.usuarioEncontrado) {
      alert('Debe buscar un usuario primero');
      return;
    }

    if (this.nuevoBarbero.nombre && this.nuevoBarbero.email && this.nuevoBarbero.telefono) {
      // Agregar barbero
      this.barberoService.agregarBarbero(this.nuevoBarbero);
      
      // Cambiar rol del usuario de USUARIO a BARBERO
      this.authService.cambiarRolUsuario(this.usuarioEncontrado.email, UserRole.BARBERO);
      
      // Actualizar lista de usuarios disponibles
      this.usuariosDisponibles = this.authService.obtenerUsuariosPorRol(UserRole.USUARIO);
      
      // Limpiar formulario
      this.nuevoBarbero = {
        nombre: '',
        email: '',
        telefono: '',
        activo: true,
        googleCalendarEmail: ''
      };
      this.emailBusquedaBarbero = '';
      this.usuarioEncontrado = null;
      this.mensajeBusquedaBarbero = '';
      
      alert('Barbero agregado correctamente. El usuario ahora tiene rol de barbero.');
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

  agregarPromocion(): void {
    if (this.nuevaPromocion.servicioId && this.nuevaPromocion.porcentajeDescuento > 0 && 
        this.nuevaPromocion.porcentajeDescuento <= 100) {
      const fechaInicio = new Date(this.nuevaPromocion.fechaInicio);
      const fechaFin = new Date(this.nuevaPromocion.fechaFin);
      
      if (fechaFin < fechaInicio) {
        alert('La fecha de fin debe ser posterior a la fecha de inicio');
        return;
      }

      this.promocionService.agregarPromocion({
        ...this.nuevaPromocion,
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString()
      });
      
      this.nuevaPromocion = {
        servicioId: 0,
        productoId: null,
        porcentajeDescuento: 0,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: new Date().toISOString().split('T')[0],
        activa: true
      };
      
      alert('Promoción agregada correctamente');
    }
  }

  eliminarPromocion(id: number): void {
    if (confirm('¿Está seguro de eliminar esta promoción?')) {
      this.promocionService.eliminarPromocion(id);
      alert('Promoción eliminada correctamente');
    }
  }

  togglePromocionActiva(promocion: Promocion): void {
    this.promocionService.actualizarPromocion(promocion.id, { activa: !promocion.activa });
  }

  obtenerNombreServicio(servicioId: number): string {
    const servicio = this.servicios.find(s => s.id === servicioId);
    return servicio ? servicio.nombre : 'Servicio no encontrado';
  }

  obtenerNombreProducto(productoId: number | null): string {
    if (!productoId) return 'Solo servicio';
    const producto = this.productos.find(p => p.id === productoId);
    return producto ? producto.nombre : 'Producto no encontrado';
  }
}
