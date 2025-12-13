import { Component ,inject} from '@angular/core';
import { FormBuilder ,FormGroup,Validators,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AutentiService } from '../../autenti.service';

@Component({
  selector: 'app-login',
  standalone :true,
  imports: [CommonModule,ReactiveFormsModule, RouterLink ,FormsModule],
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
  showRoleModal: boolean = false;
  selectedRole: 'usuario' | 'soporte' = 'usuario';
  pendingGoogleUser: any = null;


  constructor(){
    this.loginForm =this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required ,Validators.minLength(6)]]
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

   // Método para iniciar sesión con Google
  async onGoogleLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    // Primero intentamos el login sin rol para verificar si es usuario nuevo
    const result = await this.authService.loginWithGoogle();

    this.isLoading = false;

    if (result.success) {
      // Si es un usuario nuevo, mostrar modal de selección de rol
      if (result.isNewUser) {
        this.pendingGoogleUser = result.user;
        this.showRoleModal = true;
      } else {
        // Si ya existe, redirigir según su rol
        const userData = await this.authService.getUserData(result.user!.uid);
        this.redirectByRole(userData?.role);
      }
    } else {
      this.errorMessage = result.error || 'Error al iniciar sesión con Google';
    }
  }

  // Confirmar rol seleccionado
  async confirmRole() {
    if (!this.pendingGoogleUser) return;

    this.isLoading = true;
    this.showRoleModal = false;

    // Crear usuario con el rol seleccionado
    const result = await this.authService.loginWithGoogle(this.selectedRole);

    this.isLoading = false;

    if (result.success) {
      this.redirectByRole(this.selectedRole);
    } else {
      this.errorMessage = result.error || 'Error al crear usuario';
    }
  }

  // Cancelar selección de rol
  cancelRoleSelection() {
    this.showRoleModal = false;
    this.pendingGoogleUser = null;
    this.selectedRole = 'usuario';
    // Cerrar sesión del usuario pendiente
    this.authService.logout();
  }

  // Redirigir según rol
  private redirectByRole(role: string | undefined) {
    if (role === 'soporte') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/tickets']);
    }
  }

}
