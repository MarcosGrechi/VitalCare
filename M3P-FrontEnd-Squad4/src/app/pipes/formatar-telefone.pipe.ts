import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarTelefone',
  standalone: true
})
export class FormatarTelefonePipe implements PipeTransform {
  transform(telefone: string): string {
    if (telefone.length === 11) {
      // Formato para telefones com 11 dígitos (xx)xxxxx-xxxx
      return `(${telefone.substring(0, 2)})${telefone.substring(2, 7)}-${telefone.substring(7)}`;
    } else if (telefone.length === 10) {
      // Formato para telefones com 10 dígitos (xx)xxxx-xxxx
      return `(${telefone.substring(0, 2)})${telefone.substring(2, 6)}-${telefone.substring(6)}`;
    } else {
      // Retorna o telefone sem formatação se não tiver 10 ou 11 dígitos
      return telefone;
    }
  }
}