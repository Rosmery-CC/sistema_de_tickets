import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estado',
  standalone:true
})
export class EstadoPipe implements PipeTransform {

  transform(estado: string): string {
    const estadosFormateados: {[key: string]: string} = {
      'pendiente':'⏳ Pendiente',
      'en proceso':'🔄 En Proceso',
      'resuelto':'✅ Resuelto',
      'cancelado':'❌ Cancelado'

    };

    return estadosFormateados[estado.toLowerCase()] || estado;
  }

}
