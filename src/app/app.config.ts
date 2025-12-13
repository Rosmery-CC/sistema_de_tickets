import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp , initializeApp } from '@angular/fire/app';
import { provideAuth ,getAuth } from '@angular/fire/auth';
import { provideFirestore ,getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>initializeApp(environment.firebaseConfig)),
       provideAuth(() => {
      const auth = getAuth();
      // Configurar persistencia LOCAL para mantener sesión
      // Esto asegura que la autenticación persista incluso después de recargar la página
      return auth;
    }),
    provideFirestore(()=> getFirestore())
  ]
};
  