import { inject, Inject } from "@angular/core";
import {Router , CanActivateFn} from '@angular/router';
import { AutentiService } from "../autenti.service";
import {map ,take } from 'rxjs/operators';


//guardia para protejer rutas que requiren autenticación
export const authGuard : CanActivateFn =(route ,state)=>{
    const authService = inject(AutentiService);
    const router = inject(Router);

    return authService.user$.pipe(
        take(1),
        map(user=> {
            if(user ){
                return true;
            }else{
                router.navigate(['/login']);
                return false;
            }
        })
    );
};



//Guard especifico  para rutas de soporte tecnico  
export const soporteGuard : CanActivateFn = async (route , state )=>{
    const authService = inject(AutentiService);
    const router =inject(Router);


    const currentUser = authService.currentUser;
    

    if(!currentUser){
        router.navigate(['/login']);
        return false ;
    }

    const userData = await authService.getUserData(currentUser.uid);

    if (userData?.role === 'soporte' ){
        return true 
    }else {
        router.navigate(['/tickets']);
        return false;
    }


};
