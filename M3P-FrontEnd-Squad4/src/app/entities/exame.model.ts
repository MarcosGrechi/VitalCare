import { Paciente } from './paciente.model';

export class Exame {
  constructor(
    public id: number,
    public nomeExame: string,
    public dataExame: Date,
    public horarioExame: string,
    public tipoExame: string,
    public laboratorio: string,
    public urlDocumento: string,
    public resultados: string,
    public idPaciente: string
  ) {}

  
}