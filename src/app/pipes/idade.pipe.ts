import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idade',
  standalone: true
})
export class IdadePipe implements PipeTransform {
  transform(dataNascimento: string): number {
    if (!dataNascimento) return 0;

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesHoje = hoje.getMonth() + 1;
    const mesNascimento = nascimento.getMonth() + 1;

    if (mesHoje < mesNascimento || (mesHoje === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  }
}
