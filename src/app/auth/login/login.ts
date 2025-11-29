import { Component ,inject} from '@angular/core';
import { FormBuilder ,FormGroup,Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AutentiService } from '../../autenti.service';

@Component({
  selector: 'app-login',
  standalone :true,
  imports: [CommonModule,ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AutentiService);
  private router = inject(Router);


  loginForm :FormGroup ;
  errorMessage :string = '';
  isLoading :boolean = false;

  constructor(){
    this.loginForm =this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required ,Validators.minLength]]
    });
  }


  // Método para iniciar sesión
  async onSubmit (){
    if (this.loginForm.invalid){
      this.markFormGroupTouched(this.loginForm);
      return
    }

    this.isLoading =true;
    this.errorMessage = ' ';

    const{email,password}=this.loginForm.value;
    const result = await this.authService.login(email,password);

    this.isLoading=false;
    
    if(result.success){
      //redirige segun el rol del usuario
      const userDate =await this.authService.getUserData(result.user!.uid);

      if(userDate?.role ==='soporte'){
        this.router.navigate(['/dashboard']);      
      }else{
        this.router.navigate(['/tickets']);
      }
    }else{
      this.errorMessage=result.error||'Error al iniciar la seccion ';
    }
  }
 // Marcar todos los campos como tocados para mostrar errores
 private markFormGroupTouched(FormGroup:FormGroup){
  Object.keys(FormGroup.controls).forEach((key:string)=>{
    const control =FormGroup.get(key);
    control?.markAsTouched();  
  });
 }
 //Metodos auxiliares para validaciones en el template

 get email (){return this.loginForm.get('email');}
 get password (){return this.loginForm.get('password');}


}
