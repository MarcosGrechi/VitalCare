import { Paciente } from './paciente.model';

export class Consulta {
  constructor(
    public id: number,
    public motivo: string,
    public dataConsulta: Date,
    public horarioConsulta: string,
    public descricaoProblema: string,
    public medicacaoReceitada: string,
    public dosagemPrecaucoes: string,
    public idPaciente: string
  ) {}
}