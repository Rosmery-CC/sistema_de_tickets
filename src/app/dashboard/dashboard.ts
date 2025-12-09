import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ticketService , Ticket } from '../services/ticketservice';
import { AutentiService } from '../autenti.service';
import { EstadoPipe } from '../pipes/estado-pipe';
import { TiempoRelativoPipe } from '../pipes/tiempo-relativo-pipe';


interface Estadisticas{
  total: number;
  pendientes: number;
  enProceso: number;
  resueltos: number;
}

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CommonModule , RouterLink , EstadoPipe ,TiempoRelativoPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private  ticketService = inject(ticketService);
  private authService = inject(AutentiService);


  estadisticas: Estadisticas ={
    total: 0,
    pendientes: 0,
    enProceso: 0,
    resueltos: 0,
  };

  ticketsRecientes: Ticket[]=[];
  isLoading: boolean = true;
  userName: string ='';

  async ngOnInit(){
    await this.cargarUsuario();
    this.cargarEstadisticas();
    this.cargarTicketsRecientes();
  }

  async cargarUsuario(){
    const currentUser = this.authService.currentUser;
    if(currentUser){
      const userData = await this.authService.getUserData(currentUser.uid);
      this.userName = userData?.displayName || currentUser.email || 'soporte';
    }
  }

  async cargarEstadisticas(){
    this.estadisticas = await this.ticketService.obtenerEstadistica();
  }

  cargarTicketsRecientes(){
    this.ticketService.getTodosLosTickets().subscribe({
      next: (tickets)=> {
        this.ticketsRecientes = tickets.slice(0, 5);
        this.isLoading = false;
      },
      error: (error)=>{
        console.error('Error al cargar tickets:', error);
        this.isLoading = false;
      }
    });
  }

  getPorcentaje(cantidad: number): number {
    if (this.estadisticas.total ===0) return 0;
    return Math.round((cantidad / this.estadisticas.total)*100);
  }

  getEstadoClass(estado: string): string{
    const clases: { [key:string]: string}={
      'pendiente': 'badge-pendiente',
      'en proceso': 'badge-proceso',
      'resuelto': 'badge-resuelto'
    };
    return clases[estado] || '';
  }

  getPrioridadClass(prioridad: string): string {
    const clases: { [key: string]: string } = {
      'baja': 'badge-baja',
      'media': 'badge-media',
      'alta': 'badge-alta'
    };
    return clases[prioridad] || '';
  }

  getFecha(fecha: any): Date {
    if (!fecha) return new Date();
    if (fecha && typeof fecha.toDate === 'function') {
      return fecha.toDate();
    }
    if (fecha instanceof Date) {
      return fecha;
    }
    return new Date(fecha);
  }
  
  async cerrarSesion() {
    await this.authService.logout();
  }

  




}
