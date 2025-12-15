
## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


# Sistema de Tickets de Soporte
Plataforma web para la gestión de solicitudes de soporte técnico, desarrollada con Angular y Firebase, que permite a los usuarios reportar problemas y al personal de soporte gestionarlos de manera eficiente.


## Descripción del Proyecto
Este sistema permite:
- A los **usuarios** crear y hacer seguimiento de  sus propios tickets de soporte
- Al **personal de soporte** gestionar, actualizar,hacer seguimiento de todos los tickets y resolver     solicitudes
- Visualización de métricas y estadísticas en tiempo real
- Diferenciación visual clara entre roles de usuario


## Características Principales

### Para Usuarios:
- Registro e inicio de sesión seguro
- Creación de tickets de soporte con título, descripción y prioridad
- Visualización de sus propios tickets
- Seguimiento del estado de cada ticket
- Filtros y búsqueda en tiempo real
- Historial completo de cambios

### Para Soporte Técnico:
- Dashboard con métricas y estadísticas visuales
- Vista de todos los tickets del sistema
- ctualización de estado de tickets (Pendiente → En Proceso → Resuelto)
-  Eliminación de tickets
- Panel lateral con accesos rápidos
- Filtros avanzados por estado y prioridad
- Identificación visual de tickets urgentes

---

## Tecnologías Utilizadas

### Frontend:
- **Angular 18** (Standalone Components)
- **TypeScript**
- **Reactive Forms** para manejo de formularios
- **RxJS** para programación reactiva
- **CSS3** con animaciones y transiciones

### Backend y Base de Datos:
-![Firebase](https://img.shields.io/badge/Firebase-11.10-orange)
- **Firebase Authentication** para autenticación de usuarios
- **Firebase Firestore** como base de datos NoSQL en tiempo real
- **Firebase Hosting** para despliegue en producción

### Herramientas de Desarrollo:
- **Angular CLI**
- **Git & GitHub** para control de versiones
- **VS Code** como editor de código

---

## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener:

- **Node.js** (versión 18 o superior)
- **npm** (versión 9 o superior)
- **Angular CLI** (versión 18 o superior)
- **Git**

---



## Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/Rosmery-CC/sistema_de_tickets.git
cd [SISTEMA1_DE1_TICKETS]
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase

El proyecto ya incluye la configuración de Firebase en `src/environments/environment.ts`. 

Si deseas usar tu propia base de datos:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** (Email/Password)
3. Habilita **Firestore Database**
4. Copia las credenciales de configuración
5. Reemplaza en `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "TU_MESSAGING_ID",
    appId: "TU_APP_ID"
  }
};
```
### 4. Ejecutar en modo desarrollo
```bash
ng serve 
```

La aplicación estará disponible en `http://localhost:4200`

---

##  Arquitectura del Proyecto
```
src/
├── app/
│   ├── auth/                    # Módulo de autenticación
│   │   ├── login/              # Componente de inicio de sesión
│   │   └── registro/           # Componente de registro
│   ├── guards/                  # Guards de protección de rutas
│   │   └── auth.guard.ts       # Guard de autenticación y roles
│   ├── services/               # Servicios
│   │   └── ticket.ts           # Servicio CRUD de tickets
│   ├── tickets/                # Módulo de tickets
│   │   ├── lista-tickets/      # Lista con filtros y búsqueda
│   │   ├── crear-ticket/       # Formulario de creación
│   │   └── detalle-ticket/     # Vista detallada con historial
│   ├── dashboard/              # Dashboard de soporte con métricas
│   ├── pipes/                  # Pipes personalizados
│   │   ├── estado.pipe.ts      # Pipe para formatear estados
│   │   └── tiempo-relativo.pipe.ts  # Pipe para fechas relativas
│   ├── environments/           # Configuración de Firebase
│   ├── autenti.service.ts      # Servicio de autenticación
│   └── app.routes.ts           # Configuración de rutas
└── ...
```

---

## Roles de Usuario

### Usuario Normal:
- Puede crear tickets
- Ve solo sus propios tickets
- No puede modificar estados
- Acceso: `/tickets`

### Soporte Técnico:
- Ve todos los tickets del sistema
- Puede actualizar estados de tickets
- Puede eliminar tickets
- Acceso a dashboard con métricas
- Acceso: `/dashboard` y `/tickets`

---
### Autenticación
- Login con Email/Password: Sistema tradicional de autenticación
- Google Sign-In: Inicio de sesión rápido con cuenta de Google
- Selección de Rol: Los usuarios pueden elegir entre "Usuario" o "Soporte" al registrarse con Google
- Persistencia de Sesión: Las sesiones se mantienen después de recargar la página


### Gestión de Tickets
- CRUD Completo: Crear, leer, actualizar y eliminar tickets
- Estados: Pendiente, En Proceso, Resuelto, Cancelado
- Prioridades: Baja, Media, Alta
- Historial de Cambios: Registro completo de todas las modificaciones
- Filtros Avanzados: Por estado, prioridad, búsqueda de texto
- Ordenamiento: Por fecha (más reciente/antiguo) o prioridad

### Dashboard de Soporte
- Estadísticas en Tiempo Real: Total de tickets, pendientes, en proceso, resueltos
- Tickets Recientes: Vista rápida de los últimos tickets creados
- Barras de Progreso: Visualización del estado general del sistema

### Interfaz de Usuario
- Diseño Moderno: UI profesional con gradientes y animaciones
- Responsive**: Adaptable a dispositivos móviles, tablets y desktop
- Navbar Diferenciado: Colores distintos según el rol del usuario
- Pipes Personalizados: 
- Estados con emojis (⏳ Pendiente, 🔄 En Proceso, ✅ Resuelto)
- Fechas relativas ("Hace 5 minutos", "Hace 2 horas")



## Características Técnicas Destacadas

### Componentes Standalone:
- Uso de Angular Standalone Components (sin NgModules)
- Lazy Loading de rutas para optimización

### Guards de Seguridad:
- **authGuard**: Protege rutas requiriendo autenticación
- **soporteGuard**: Restringe acceso solo a usuarios con rol de soporte

### Formularios Reactivos:
- Validaciones en tiempo real
- Mensajes de error personalizados
- Confirmación de contraseña

### Pipes Personalizados:
- **EstadoPipe**: Formatea estados con emojis (⏳ Pendiente, 🔄 En Proceso, ✅ Resuelto)
- **TiempoRelativoPipe**: Convierte fechas a formato relativo ("Hace 2 horas")

### Directivas:
- Uso extensivo de `*ngIf`, `*ngFor`, `[ngClass]`
- Property binding, Event binding, Two-way binding

### Observables y RxJS:
- Suscripciones a cambios en tiempo real de Firestore
- Manejo de estados reactivos

---

## Deploy en Producción

**URL de la aplicación desplegada:**  
🔗 **[https://sistema-de-tickets-ec231.web.app](https://sistema-de-tickets-ec231.web.app)**

### Comandos para deploy:
```bash
# Compilar para producción
ng build --configuration production

# Desplegar en Firebase Hosting
firebase deploy --only hosting
```

---

##  Manual de Usuario

### Para Usuarios:

1. **Registro:**
   - Accede a la página de registro
   - Completa: nombre, email, contraseña
   - Selecciona rol: "Usuario"
   - Haz clic en "Registrarse"

2. **Crear un Ticket:**
   - Inicia sesión
   - Haz clic en "✨ Crear Mi Ticket"
   - Completa: título, descripción, prioridad
   - Haz clic en "Crear Ticket"

3. **Ver Estado del Ticket:**
   - En "Mis Tickets", ve todos tus tickets
   - Usa filtros para buscar tickets específicos
   - Haz clic en "Ver Detalle" para ver el historial

### Para Soporte Técnico:

1. **Acceder al Dashboard:**
   - Inicia sesión con cuenta de soporte
   - Serás redirigido automáticamente al Dashboard
   - Visualiza métricas de tickets

2. **Gestionar Tickets:**
   - Haz clic en "Ver Todos los Tickets"
   - Usa el panel lateral para filtros rápidos
   - Haz clic en "🔧 Gestionar" en cualquier ticket

3. **Actualizar Estado:**
   - En el detalle del ticket, verás botones de acciones
   - Selecciona: "Marcar En Proceso" o "Marcar como Resuelto"
   - El historial se actualiza automáticamente

4. **Eliminar Ticket:**
   - En el detalle, haz clic en "Eliminar Ticket"
   - Confirma la acción

---
## Seguridad

### Guards Implementados

- authGuard: Protege rutas que requieren autenticación
- **soporteGuard**: Protege rutas exclusivas para usuarios con rol de soporte

## Reglas de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /tickets/{ticketId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'soporte';
    }
  }
}
```

---

## 🐛 Solución de Problemas

### Error: "Firebase API called outside injection context"
- **Solución:** Verifica que los servicios usen `inject()` correctamente

### Error: "The query requires an index"
- **Solución: Haz clic en el enlace del error para crear el índice automáticamente en Firebase Console

### Error al hacer login
- **Solución:Verifica las reglas de Firestore y que el usuario exista en Authentication

---

## Personalización

### Colores del Tema

Los colores principales se pueden modificar en los archivos CSS:

```css
/* Gradiente principal (morado) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Gradiente de soporte (gris oscuro) */
background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
```

### Estados de Tickets

Modifica `estado.pipe.ts` para personalizar los emojis:

```typescript
const estadosFormateados = {
  'pendiente': '⏳ Pendiente',
  'en proceso': '🔄 En Proceso',
  'resuelto': '✅ Resuelto',
  'cancelado': '❌ Cancelado'
};
```
## Video Demostrativo

Enlace al video:**  
[Pendiente - Se agregará después de grabar]

El video incluye:
- Funcionalidades principales del sistema
- Flujo de autenticación (registro y login)
- Creación y gestión de tickets
- Panel de soporte y actualización de estados
- Explicación de la arquitectura del código
- Demostración de componentes, servicios y guards

Duración:5-8 minutos

(---https://drive.google.com/drive/folders/1M63vLVpJaGDFcoieaML96nxiWrP8FGBI)


## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**[ROSMERY CCORIMANYA HUAMAN ]**  
- GitHub: [Rosmery-CC](https://github.com/Rosmery-CC)
- Email: 1002820232@UNAJMA.EDU.PE

---

## 📅 Información del Proyecto

- **Curso:** Programación Web con Angular
- **Profesor:** Iván Soria Solis
- **Fecha de entrega:** Diciembre 12, 2025
- **Duración del desarrollo:** 5 semanas

---

## 🙏 Agradecimientos

- A Firebase por proporcionar servicios backend gratuitos
- A la comunidad de Angular por la documentación y recursos
- Al profesor Iván Soria por la guía durante el desarrollo

---

