import { Endereco } from "./endereco.model";

export class Paciente {
  constructor(
    public id: number,
    public nome: string,
    public genero: string,
    public dataNascimento: Date,
    public cpf: string,
    public rg: string,
    public orgaoExpedidor: string,
    public estadoCivil: string,
    public telefone: string,
    public email: string,
    public naturalidade: string,
    public contatoEmergencia: string,
    public endereco: Endereco, 
    // public cep: string,
    // public rua: string,
    // public numero: string,
    // public complemento: string,
    // public bairro: string,
    // public cidade: string,
    // public estado: string,
    // public ptoReferencia: string,
    public listaAlergias: string,
    public listaCuidados: string,
    public convenio: string,
    public numeroConvenio: string,
    public validadeConvenio: Date,
    public idade?: number
  ) {}
}

