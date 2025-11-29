import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';
import { AuthGuard } from '@angular/fire/auth-guard';
import { authGuard, soporteGuard } from './guards/auth.guard';


export const routes: Routes = [
    { path:'',redirectTo:'/login',pathMatch: 'full'},
    { path:'login',component :Login},
    { path:'registro',component :Registro},
  
   
    //Rutas  protegidos para usuarios
    {
        path:'tickets',
        canActivate:[authGuard],
        loadComponent :()=>import('./tickets/lista-tickets/lista-tickets').then(m=>m.ListaTickets)
    },

    {
        path:'tickets/crear',
        canActivate:[authGuard],
        loadComponent : ()=> import('./tickets/crear-ticket/crear-ticket').then(m => m.CrearTicket)
    },

    {
        path:'tickets/:id',
        canActivate:[authGuard],
        loadComponent : ()=> import('./tickets/detalle-ticket/detalle-ticket').then(m => m.DetalleTicket)
    },

    //Ruta protegida para Soporte 
    {
        path:'dashboard',
        canActivate :[authGuard,soporteGuard],
        loadComponent :()=> import('./dashboard/dashboard').then(m => m.Dashboard)
    },

    {path: '**',redirectTo:'/login'}
];
