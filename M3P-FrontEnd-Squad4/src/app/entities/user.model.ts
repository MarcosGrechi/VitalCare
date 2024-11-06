export class User {
  constructor(
    public id: number,
    public email: string,
    public profile: string,
    public password: string,
    public nomeCompleto?: string,
    public dataNascimento?: Date,
    public cpf?: string,
    public telefone?: string
  ) {}
}
