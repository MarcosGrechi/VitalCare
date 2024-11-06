export interface LoginResponse {
    token: string;
    tempoExpiracao: number;
    listaNomesPerfis?: string[];
    pacienteId?: string;     
  }
  