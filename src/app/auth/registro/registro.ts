import { Component, inject } from '@angular/core';
import { FormBuilder , FormGroup ,Validators ,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutentiService} from '../../autenti.service';
import { object } from '@angular/fire/database';//

@Component({
  selector: 'app-registro',
  standalone:true,
  imports: [ CommonModule,ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private fb= inject(FormBuilder);
  private autentiService = inject(AutentiService);
  private router =inject(Router);

  registroForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(){
    this.registroForm =this.fb.group({
      displayName :['',[Validators.required,Validators.minLength(3)]],
      email :['', [Validators.required ,Validators.email]],
      password : ['',[Validators.required,Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['usuario', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

//Validador personalizado para confirmar contraseña
passwordMatchValidator(from:FormGroup){
  const password=from.get('password')?.value;
  const confirmPassword =from.get('confirmPassword')?.value;

  if (password !==confirmPassword ){
    from.get('confirmPassword')?.setErrors({passwordMismatch:true});
    return {passwordMismatch :true};
  }
  return null;

}

// // Método para registrar usuario
async onSubmit(){
  if(this.registroForm.invalid){
    this. markFormGroupTouched(this.registroForm);
    return
  }
  this.isLoading = true;
  this.errorMessage ='';
  this.successMessage= '';

  const {displayName ,email ,password ,role} = this.registroForm.value;
  const result = await this.autentiService.register(email, password, displayName, role);
  this.isLoading = false;

  if(result.success){
    this.successMessage='!Regristro exitoso ! Redirigiendo...'
    setTimeout(()=>{
      this.router.navigate(['/login']); 
    },2000);
  }else{
    this.errorMessage =result.error ||'Error al registrar usuario '
  }
}
 // Marcar todos los campos como tocados para mostrar errores

 private markFormGroupTouched(FormGroup:FormGroup){
  Object.keys(FormGroup.controls).forEach((key:string)=>{
    const control =FormGroup.get(key);
    control?.markAsTouched();
  });
 }


 // Métodos auxiliares para validaciones en el template
  get displayName() { return this.registroForm.get('displayName'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }
  get confirmPassword() { return this.registroForm.get('confirmPassword'); }
  get role() { return this.registroForm.get('role'); }

}
