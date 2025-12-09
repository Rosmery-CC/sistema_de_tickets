import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,Router, RouterLink } from '@angular/router';
import { Ticket, ticketService } from '../../services/ticketservice';
import { AutentiService } from '../../autenti.service';
import { EstadoPipe } from '../../pipes/estado-pipe';
import { TiempoRelativoPipe } from '../../pipes/tiempo-relativo-pipe';


@Component({
  selector: 'app-detalle-ticket',
  standalone : true,
  imports: [CommonModule , RouterLink , EstadoPipe,TiempoRelativoPipe],
  templateUrl: './detalle-ticket.html',
  styleUrl: './detalle-ticket.css',
})
export class DetalleTicket  implements OnInit{
  private ticketService = inject(ticketService);
  private authService = inject(AutentiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ticket : Ticket | null = null;
  isLoading : boolean =true;
  userRole : string = '';
  errorMessage : string ='';
  successMessage : string = '';
  isUpdating : boolean = false ;


  async ngOnInit() {
    await this.cargarUsuario();
    this.cargarTicket();

  }

  async cargarUsuario(){
    const currentUser = this.authService.currentUser;
    if (currentUser){
      const userData = await this.authService.getUserData(currentUser.uid);
      this.userRole = userData?.role || 'usuario';
    }
  }

 
  cargarTicket(){
    const ticketId= this . route.snapshot.paramMap.get('id');

    if(!ticketId){
      this.router.navigate(['/tickets']);
      return;
    }
    this.ticketService.getTicketPorID(ticketId).subscribe({
    next:(ticket)=>{
      this.ticket=ticket;
      this.isLoading=false; 
    },
    error:(error)=>{
      console.error('Error al cargar ticket ', error);
      this.errorMessage='Error al cargar el ticket';
      this.isLoading=false;
    }
  });
  }


  async actualizarEstado(nuevoEstado:'pendiente' | 'en proceso' | 'resuelto'){
    if(!this.ticket?.id)return;

    this.isUpdating= true;
    this.errorMessage='';
    this.successMessage='';

    const currentUser =this.authService.currentUser;
    if(!currentUser)return;


    const userData=await this.authService.getUserData(currentUser.uid);
    const nombreUsuario = userData?.displayName || currentUser.email||'usuario';


    const result = await this.ticketService.actualizarEstado(
      this.ticket.id,
      nuevoEstado,
      nombreUsuario
    );

    this.isUpdating=false;

    if(result.success){
      this.successMessage = 'Estado actualizado correctamente ';
      setTimeout(()=>{
        this.successMessage='';
      },3000);
    }else{
      this.errorMessage=result.error||'Error al actualizar el estado ';
    }
  }

  async eliminarTicket(){
    if(!this.ticket?.id)return;

    const confirmar = confirm('¿Estas seguro de que deseas eliminar este ticket');
    if (!confirmar)return;
    
    const  result = await this.ticketService.eliminarTicket(this.ticket.id);


    if (result.success){
      this.router.navigate(['/tickets']);
    }else {
      this.errorMessage=result.error ||'Error al eliminar el ticket';

    }
  }


  getEstadoClass(estado :string):string{
    const clases :{[key:string]:string}={
      'pendiente':'badge-pendiente',
      'en proceso':'badge-proceso',
      'resuelto':'badge-resuelto'
    };
    return clases[estado]||'';
  }

  getPrioridadClass(prioridad:string):string{
    const clases :{[key:string]:string}={
      'baja':'badge-baja',
      'media':'badge-media',
      'alta':'badge-alta'
    };
    return clases[prioridad]||'';
  }

  getFecha(fecha:any): Date{
    if(!fecha)return new Date();
    if (fecha && typeof fecha.toDate ==='function'){
      return fecha.toDate();
    }
    if(fecha instanceof Date){
      return fecha;
    }
    return new Date(fecha);
  }

  volverAtras(){
    this.router.navigate(['/tickets']);
  }
}
