import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DireccionComponent } from './direccion/direccion.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { ResenasComponent } from './resenas/resenas.component';
import { AcercaDeComponent } from './acerca-de/acerca-de.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { AdminComponent } from './admin/admin.component';
import { BarberoComponent } from './barbero/barbero.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/user.model';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'direccion', component: DireccionComponent},
    {path: 'galeria', component: GaleriaComponent},
    {path: 'resenas', component: ResenasComponent},
    {path: 'acerca-de', component: AcercaDeComponent},
    {path: 'servicios', component: ServiciosComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'barbero', component: BarberoComponent},
    {path: '**', redirectTo: '/home'}
];
