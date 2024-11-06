import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'esconderSenha',
  standalone: true
})
export class EsconderSenhaPipe implements PipeTransform {

  transform(password: string): string {
    const parteVisivel = password.substring(0, 4);
    const parteOculta = '*'.repeat(password.length - 4);
    return `${parteVisivel}${parteOculta}`;
  }

}
