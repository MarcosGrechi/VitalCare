import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horario',
  standalone: true
})
export class HorarioPipe implements PipeTransform {

  transform(horario: number[]): string {
    if (Array.isArray(horario) && horario.length === 2) {
      const [hours, minutes] = horario;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return '';
  }
  
}
