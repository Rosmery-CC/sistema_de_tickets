import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoRelativo',
  standalone: true
})
export class TiempoRelativoPipe implements PipeTransform {

  transform(fecha: Date | any): string {
    if(!fecha)return '';

    // convertir timestamp de firestores  a Date
    let fechaDate:Date;

    if(fecha.toDate && typeof fecha.toDate === 'function'){
      fechaDate = fecha.toDate();
    }else if (fecha instanceof Date){
      fechaDate = fecha;
    }else{
      fechaDate = new Date(fecha);
    }

    const ahora = new Date();
    const diferencia =ahora.getTime() - fechaDate.getTime();


    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(dias / 365);

    if(segundos<60) return 'Hace un momento';
    if(minutos<60)return  `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    if(horas <24)return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if(dias <30)return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if(meses <12)return  `Hace ${meses} mes${meses > 1 ? 'es' : ''}`;

     
    return `Hace ${años} año${años > 1 ? 's' : ''}`;
  }

}
