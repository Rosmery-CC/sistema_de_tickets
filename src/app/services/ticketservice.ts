import { Injectable ,inject } from '@angular/core';
import { Firestore ,collection ,doc ,addDoc , updateDoc ,deleteDoc ,getDoc, getDocs,query,where,orderBy ,Timestamp,collectionData,docData } from '@angular/fire/firestore';
import { AutentiService } from '../autenti.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { dataConnectInstance$ } from '@angular/fire/data-connect';
import { Data } from '@angular/router';


//interfaz para el Ticket
export interface Ticket{
  id?:string;
  titulo:string;
  descripcion:string;
  prioridad :'baja'| 'media' | 'alta' ;
  estado : 'pendiente'|'en proceso' |'resuelto',
  usuarioId : string;
  usuarioNombre :string;
  usuarioEmail:string;
  fechaCreacion :Date;
  fechaActualizacion : Date;
  historial?:HistorialCambio[];
}

//interfaz para el historial de cambios
export interface HistorialCambio{
  fecha: Date;
  cambio: string;
  usuario: string;
}
@Injectable({
  providedIn: 'root',
})
export class ticketService {
  private firestore=inject(Firestore);
  private authService = inject(AutentiService);
  private ticketsCollection =collection(this.firestore,'tickets');
  
  //para crear nuevos tickets
  async crearTicket(tickets:Omit<Ticket,'id'|'fechaCreacion'|'fechaActualizacion'|
    'historial'> ) :Promise<{success:boolean ; id?:string ; error?: string }>{
     try{
      const nuevoTicket={
        ...tickets,
        fechaCreacion : new Date(),
        fechaActualizacion : new Date(),
        historial :[{
          fecha : new Date (),
          cambio :'Ticket creado',
          usuario :tickets.usuarioNombre
        }]
      };
      const docRef = await addDoc(this.ticketsCollection,nuevoTicket);
      return{success : true , id: docRef.id};
     } catch (error :any ){
      console.error('Error al crear ticket:',error);
      return{success: false ,error:'Error al crear el ticket'};
     }
    }
  // Para obtener todos los tickets de un usuario
  getTicketsPorUsuario(usuarioId:string): Observable<Ticket[]>{
    const q = query(
      this.ticketsCollection,
      where('usuarioId','==',usuarioId),
      orderBy('fechaCreacion','desc')
    );
    return collectionData(q ,{idField: 'id'}).pipe(
      map((tickets:any[])=> tickets.map(ticket=>({
        ...ticket,
        fechaCreacion: ticket.fechaCreacion?.toDate ? ticket.fechaCreacion.toDate() : ticket.fechaCreacion,
        fechaActualizacion: ticket.fechaActualizacion?.toDate ? ticket.fechaActualizacion.toDate(): ticket.fechaActualizacion,
        historial: ticket.historial?.map((h:any) =>({
          ...h,
        fecha:h.fecha?.toDate ? h.fecha.toDate(): h.fecha
        }))
      }))
    )) as Observable<Ticket[]>;
    
  }
  
  //Obtener todos los tickets (para los soportes )
getTodosLosTickets(): Observable<Ticket[]> {
  const q = query(this.ticketsCollection, orderBy('fechaCreacion', 'desc'));
  return collectionData(q, { idField: 'id' }).pipe(
    map((tickets: any[]) => tickets.map(ticket => ({  
      ...ticket,
      fechaCreacion: ticket.fechaCreacion?.toDate ? ticket.fechaCreacion.toDate() : ticket.fechaCreacion,
      fechaActualizacion: ticket.fechaActualizacion?.toDate ? ticket.fechaActualizacion.toDate() : ticket.fechaActualizacion,
      historial: ticket.historial?.map((h: any) => ({
        ...h,
        fecha: h.fecha?.toDate ? h.fecha.toDate() : h.fecha
      }))
    }))
  )) as  Observable<Ticket[]>;
}

  //Obtener un ticket por ID
  getTicketPorID(id :string):Observable<Ticket>{
    const ticketDoc = doc(this.firestore,`tickets/${id}`);
    return docData(ticketDoc , {idField: 'id'}).pipe (
      map((ticket: any)=>({
        ...ticket,
        fechaCreacion:ticket.fechaCreacion?.toDate ? ticket.fechaCreacion.toDate():ticket.fechaCreacion,
        fechaActualizacion: ticket.fechaActualizacion?.toDate ? ticket.fechaActualizacion.toDate():ticket.fechaActualizacion,
        historial: ticket.historial?.map((h:any)=>({
          ...h,
          facha: h.facha?.toDate ? h.facha.toDate(): h.facha
        }))
      }))
    )as Observable<Ticket>;
  }


  //Para Actualizar el estado de un ticket
  async actualizarEstado(
    ticketID : string ,
    nuevoEstado : 'pendiente'|'en proceso' | 'resuelto' ,
    usuarioNombre : string 
  ):Promise<{ success : boolean; error?:string }>{
    try{
      const ticketRef = doc(this.firestore ,`tickets/${ticketID}` );
      const ticketDoc =await getDoc(ticketRef);

      if (!ticketDoc.exists()){
        return {success : false , error :'Ticket no encontrado'};
      }
          const ticketData = ticketDoc.data()as Ticket;
    const nuevoHistorial =[
      ...(ticketData.historial || []),
      {
        fecha : new Date(),
        cambio :`Estado cambiado a: ${nuevoEstado}`,
        usuario : usuarioNombre
      }
    ];
    await updateDoc (ticketRef ,{
      estado : nuevoEstado,
      fechaActualizacion : new Date(),
      historial : nuevoHistorial

    });

    return{ success:true};
  }catch (error :any){
    console.error('Error al actualizar estado:',error);
    return{ success : false , error :'Error al actualizar el estado '};
  }
}
//Actualizar ticket completo 
async actualizarTicket(
  ticketID : string,
  cambios : Partial<Ticket>,
  usuarioNombre : string
):Promise<{success : boolean ; error?:string}>{
  try {
    const ticketRef = doc (this.firestore,`tickets/${ticketID}`);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()){
      return{ success: false ,error : 'ticket  no encontrado '};
    }

    const tickerData =ticketDoc.data() as Ticket;
    const cambiosTexto = Object.keys(cambios).map(key =>`${key} actualizado`).join(',' );
    
    const nuevoHistorial =[
      ...(tickerData.historial || []),
      {
        fecha : new Date(),
        cambio : cambiosTexto,
        usuario : usuarioNombre
      }
    ];
    await updateDoc(ticketRef ,{
      ...cambios,
      fechaActualizacion: new Date (),
      historial:nuevoHistorial
    });
    return{success: true};
  }catch(error : any){
    console.error('Error al actualizar tickets:',error);
    return{ success:false , error :'Error al actualizar el ticket '};
  }
}

//Pera eliminar ticket
async eliminarTicket( ticketID : string): Promise<{success:boolean;error?: string}>{
  try{
    const ticketRef = doc (this.firestore,`tickets/${ticketID}`);
    await deleteDoc(ticketRef);
    return{success : true};
  }catch(error : any ){
    console.error('Error al  eliminar ticket ', error);
    return {success : false , error :'Error al eliminar el ticket'};
  }
}
// filtrar  tickets por estado
getTicketsPorEstado(estado : 'pendiente'|'en proceso' | 'resuelto'):Observable<Ticket[]>{
  const q = query(
    this.ticketsCollection,
    where('estado','==',estado),
    orderBy('fechaCreacion','desc')
  );
  return collectionData(q ,{idField :'id'}).pipe(
    map((tickets:any[])=> tickets.map(ticket=>({
      ...ticket,
      fechaCreacion: ticket.fechaCreacion?.toDate ? ticket.fechaCreacion.toDate() : ticket.fechaCreacion,
      fechaActualizacion: ticket.fechaActualizacion?.toDate ? ticket.fechaActualizacion.toDate() : ticket.fechaActualizacion,
       historial: ticket.historial?.map((h: any)=>({
        ...h,
        fecha: h.facha?.toDate ? h.facha.toDate() :h.facha
       }))
    }))
  )) as Observable<Ticket[]>;

}

//Obtener estadistica (para el dasboard)
async obtenerEstadistica():Promise<{
  total: number;
  pendientes : number;
  enProceso: number ;
  resueltos : number;
}>{
  try{
    const snapshot =await getDocs(this.ticketsCollection);
    const tickets =snapshot.docs.map(doc=>doc.data() as Ticket );

    return {
      total :tickets.length,
      pendientes: tickets.filter (t => t.estado === 'pendiente').length,
      enProceso : tickets.filter (t => t.estado === 'en proceso').length,
      resueltos : tickets.filter(t=> t.estado === 'resuelto').length,
    };
  }catch (error){
    console.error('Error al obtener estadisticas ',error );
    return { total :0 , pendientes : 0, enProceso : 0,resueltos :0};
  }
}
    
}
