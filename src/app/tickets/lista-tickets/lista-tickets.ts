import { Component , inject ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Ticket, ticketService } from '../../services/ticketservice';
import { AutentiService } from '../../autenti.service';
import { consumerAfterComputation } from '@angular/core/primitives/signals';




@Component({
  selector: 'app-lista-tickets',
  standalone: true,
  imports: [CommonModule ,RouterLink, FormsModule],
  templateUrl: './lista-tickets.html',
  styleUrl: './lista-tickets.css',
})
export class ListaTickets  implements OnInit{
  private ticketService =inject(ticketService);
  private authService =inject (AutentiService);
  

  tickets :Ticket[]=[];
  ticketsFiltrados :Ticket[]=[];
  isLoading :boolean =true;
  userRole:string ='';


  //filtros 

  filtroEstado : string ='todos';
  filtroPrioridad : string ='todos';
  busqueda : string ='';


  //Ordenamiento
  ordenActual : string='fecha-desc';

  async ngOnInit(){
    await this.cargarUsuario();
    this.cargarTickets();
  }

  async cargarUsuario(){
    const currentUser =this.authService.currentUser;
    if(currentUser){
      const userData = await this.authService.getUserData(currentUser.uid);
      this.userRole =userData?.role||'usuario';
    }
  }

cargarTickets(){
  this .isLoading = true;
  const currentUser =this.authService.currentUser;

  if(!currentUser){
    this.isLoading= false ;
    return;
  }
  //Si es soporte , ver todas los tickets ; si es usuario solo ver los suyos 
  const tickets$ = this.userRole === 'soporte'
  ? this.ticketService.getTodosLosTickets()
  : this.ticketService.getTicketsPorUsuario(currentUser.uid);


  tickets$.subscribe({
    next:(tickets)=>{
      this.tickets = tickets;
      this.aplicarFiltros();
      this.isLoading=false;
    },
    error: (error)=>{
      console.error('Error al cargar tickets:',error);
      this.isLoading=false;
    }
  }); 
}


aplicarFiltros(){
  let resultado =[...this.tickets];


  //filtro por estado

  if (this.filtroEstado !=='todos'){
    resultado = resultado.filter(t=>t.estado === this.filtroEstado);
  }


  //filtro por prioridad 
  if(this.filtroPrioridad !=='todos'){
    resultado=resultado.filter(t=>t.prioridad===this.filtroPrioridad);
  }

  // Busqueda en tiempo  real
  if(this.busqueda.trim()){
    const termino =this.busqueda.toLowerCase();
    resultado = resultado.filter(t=>
      t.titulo.toLowerCase().includes(termino)||
      t.descripcion.toLowerCase().includes(termino)||
      t.usuarioNombre.toLowerCase().includes(termino)
    );
  }

  //Ordenamiento
  this.ordenarTickets(resultado);

  this.ticketsFiltrados = resultado;
}

ordenarTickets(tickets:Ticket[]){
  switch(this.ordenActual){
    case 'fecha-desc':
      tickets.sort((a ,b)=>
        new Date(b.fechaCreacion).getTime() -new Date(a.fechaCreacion).getTime()
      );
      break;
    case 'fecha-asc':
      tickets.sort((a ,b)=>
      new Date(a.fechaCreacion).getTime()-new Date(b.fechaCreacion).getTime()
      );
      break
    case 'prioridad':
      const prioridades ={alta:3 ,media:2 ,baja:1};
      tickets.sort((a , b)=> prioridades[b.prioridad] - prioridades[a.prioridad])
      break; 
  } 
}
 
onFiltroEstadoChange(){
  this.aplicarFiltros();
}

onFiltroPrioridadChange(){
  this.aplicarFiltros();
}

onBusquedaChange(){
  this.aplicarFiltros();
}

onOrdenChange(){
  this.aplicarFiltros();
}

getEstadoClass(estado:string):string{
  const clases:{ [key:string]:string }={
    'pendiente':'badge-pendiente',
    'en proceso': 'badge-proceso',
    'resuelto':'badge-resuelto', 
  };
  return clases[estado] || ' ';
}

getPrioridadClass(prioridad:string):string{
  const clases:{ [key:string]:string}={
    'baja': 'badge-baja',
    'media':'badge-media',
    'alta':'badge-alta'
  };
  return clases[prioridad] || '';
}

async cerrarSesion(){
  await this.authService.logout();
}

}
