import { Component ,inject } from '@angular/core';
import { FormBuilder , FormGroup , Validator , ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import  {ticketService} from  '../../services/ticketservice';
import { AutentiService } from '../../autenti.service';
import { timeInterval } from 'rxjs';
import { object } from '@angular/fire/database';



@Component({
  selector: 'app-crear-ticket',
  standalone : true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './crear-ticket.html',
  styleUrl: './crear-ticket.css',
})
export class CrearTicket {
  private fb = inject(FormBuilder);
  private ticketService =inject(ticketService);
  private authService = inject(AutentiService);
  private router = inject(Router);

  ticketForm :FormGroup ;
  errorMessage:string ='';
  successMessage : string ='';
  isLoading : boolean =false;

  constructor(){
    this.ticketForm = this.fb.group({
      titulo :['',[Validators.required , Validators.minLength(5)]],
      descripcion:[ '',[Validators.required , Validators.minLength(10)]],
      prioridad : ['media',[Validators.required]]
    });
  }

  async onSubmit(){
    if(this.ticketForm.invalid){
      this.markFormGroupTouched(this.ticketForm);
      return;
    }
    this.isLoading=true;
    this.errorMessage= '';
    this.successMessage ='';


    const currentUser =this.authService.currentUser;
    if(!currentUser){
      this.errorMessage='Debes estar autenticado para crear un ticket';
      this.isLoading =  false;
      return;
    }
    
    const userData =await this.authService.getUserData(currentUser.uid);

    const nuevoticket ={
      ...this.ticketForm.value,
      estado:'pendiente' as const,
      usuarioId:currentUser.uid,
      usuarioNombre : userData?.displayName||currentUser.email||'Usuario',
      usuarioEmail :currentUser.email||''
    };

    const result =await this.ticketService.crearTicket(nuevoticket);
    this.isLoading=false;

    if(result.success){
      this.successMessage='¡Ticket creado exitosamente';
      setTimeout(()=>{
        this.router.navigate(['/tickets']);
      },1500);
    }else {
      this.errorMessage=result.error ||'Error al crear el ticket'; 
    }
  }


  private markFormGroupTouched(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(key =>{
      const control =formGroup.get(key);
      control?.markAllAsTouched();
    });
  }

  get titulo( ){return this.ticketForm.get('titulo');}
  get descripcion (){return this.ticketForm.get('descripcion');}
  get prioridad(){return this.ticketForm.get('prioridad');}
}
