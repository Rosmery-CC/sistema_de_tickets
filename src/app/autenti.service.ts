import { Injectable ,inject } from '@angular/core';
import { Auth,createUserWithEmailAndPassword ,signInWithEmailAndPassword ,signOut,User,user } from '@angular/fire/auth';
import { Firestore ,doc ,setDoc ,getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { terminate } from 'firebase/firestore';
import { Observable } from 'rxjs';
// estructura de datos del usuario 
export interface UserData{
  uid:string;    //id unico de usuario 
  email:string; //correo electronico
  displayName:string; // Nombre completo
  role:'usuario'|'soporte'; // usuario o  soporte , solo uno de ellos 
}
@Injectable({
  providedIn: 'root'
})
export class AutentiService {
  private auth: Auth =inject(Auth); // manejo de regristros o login 
  private firestore :Firestore=inject(Firestore); // para guardar datos extra del usuario 
  private router : Router =inject(Router); // para redirigir despues de login
  
  
  user$:Observable<User | null>;
  currentUser : User | null = null; // usuario actual  logueado (inicia secion ) o nulo si no hay nadie 


constructor() {
  this.user$ =user(this.auth);
  this.user$.subscribe(user =>{
    this.currentUser =user;
  })
 }
// para registrar nuevos uuarios 
async register(email :string , password :string , displayName : string  , role : 'usuario'| 'soporte' = 'usuario'){
  try{
    const credential = await createUserWithEmailAndPassword(this.auth,email,password);
    //Guardar datos adicionales en firestore
    const userDocRef = doc(this.firestore, 'users/${credential.user.vid}');
    await setDoc(userDocRef,{
      uid: credential.user.providerData,
      email: email,
      displayName:displayName,
      role:role,
      createdAt:new Date()
    });
    return{success:true, user:credential.user}; 
  }catch(error :any){
    return{ success:false , error: this.getErrorMessage(error.code)};
  }
  
}
//para iniciar sesion
async login(email :string , password :string){
  try{
    const credential =await signInWithEmailAndPassword (this.auth,email,password);
    return {success:true ,user:credential.user};
  }catch(error:any){
    return{success:false , error:this.getErrorMessage(error.code)};
  }
}
//para cerrar  sesión
async logout(){
  try{
    await signOut(this.auth);
    this.router.navigate(['/login']);
    return{success:true};
  }catch(error){
    return{success:false ,error:'Error al cerrar sesión'};
  }
}
//obtener datos del usuario desde firestore
async getUserData(vid :string):Promise<UserData | null> {
  try{
    const userDocRef =doc(this.firestore, 'user/${vid}');
    const userDoc = await getDoc(userDocRef);

    if(userDoc.exists()){
      return userDoc.data() as UserData;

    }
    return null;
  }catch(error){
    console.error('Error al obtener datos del usuario',error);
    return null;
  }
}
// para verificar si el usuario esta autenticado 
isAuthenticated(): boolean {
  return this.currentUser !== null;

}
// para obtener vid ( id de usuarion) del usuario actual 
getCurrentUserID():string | null{
  return this.currentUser?.uid   || null ;
}
//para mensajes de error  personalizados
private getErrorMessage(errorCode:string):string{
  const getErrorMessage:{ [key: string]: string } = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
    };
    return getErrorMessage[errorCode]||'Error en la autenticacion';
}


}
