import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Paciente } from '../entities/paciente.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './authservice.service';
import { apiUrl } from '../environments/environment';
import { UserStorageService } from './users-storage.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  urlPath: string = `${apiUrl}/pacientes`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private userService: UserStorageService
  ) { }

  // atualizarPaciente(id: string, paciente: any) {
  //   const pacientes: any[] = this.obterPacientes();
  //   const indice = pacientes.findIndex(paciente => paciente.id === id);

  //   if (indice !== -1) {
  //     pacientes[indice] = { ...paciente, id: id };
  //     localStorage.setItem('pacientes', JSON.stringify(pacientes));
  //   } else {
  //     console.error('Paciente não encontrado com o ID fornecido:', id);
  //   }
  // }

  // Alteração: Método atualizado para enviar a atualização ao backend
  atualizarPaciente(id: string, paciente: any): Observable<any> {
    const headers = this.userService.getAuthHeaders(); // Obtém os cabeçalhos de autenticação
    return this.http.put(`${this.urlPath}/${id}`, paciente); // Envia a requisição PUT para atualizar um paciente no backend
  }

  // atualizarPaciente(pacienteAtualizado: any) {
  //   let pacientes: any[] = this.obterPacientes();
  //   const index = pacientes.findIndex(paciente => paciente.idPaciente === pacienteAtualizado.idPaciente);
  //   if (index !== -1) {
  //     pacientes[index] = pacienteAtualizado;
  //     localStorage.setItem('pacientes', JSON.stringify(pacientes));
  //   } else {
  //     console.error('Paciente não encontrado para atualizar.');
  //   }
  // }

  // salvarPaciente(paciente: any) {
  //   const pacientes: any[] = this.obterPacientes();
  //   paciente.id = this.gerarIdSequencial(pacientes.length + 1);
  //   pacientes.push(paciente);
  //   localStorage.setItem('pacientes', JSON.stringify(pacientes));
  // }

  // Alteração: Método atualizado para enviar uma requisição POST ao backend
  salvarPaciente(paciente: any): Observable<any> {
    const headers = this.userService.getAuthHeaders(); // Utilize o método para obter os headers
    console.log('Paciente a ser enviado:', paciente);
    // console.log('Headers:', headers);
    return this.http.post(this.urlPath, paciente, { headers }).pipe(
      tap(response => console.log('Paciente salvo com sucesso:', response)),
      catchError(this.handleError) // Tratamento de erros
    );
  }

  // private gerarIdSequencial(numero: number): string {
  //   return numero.toString().padStart(6, '0');
  // }

  obterPacientes(): Observable<Paciente[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<{ pacientes: Paciente[] }>(this.urlPath, { headers }).pipe(
      map(response => response.pacientes)
    );
  }

  // Alteração: Método atualizado para buscar os pacientes do backend
  // obterPacientes(): Observable<any[]> {
  //   const headers = this.userService.getAuthHeaders(); // Obtém os cabeçalhos de autenticação
  //   return this.http.get<Paciente[]>(this.urlPath); // Envia a requisição GET para obter todos os pacientes
  // }

  getPacientePorId(id: string): Observable<Paciente> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Paciente>(`${this.urlPath}/${id}`, { headers });
  }
  // Alteração: Método atualizado para buscar um paciente específico pelo ID no backend
  obterPacientePorId(id: string): Observable<any> {
    const headers = this.userService.getAuthHeaders(); // Obtém os cabeçalhos de autenticação
    return this.http.get<any>(`${this.urlPath}/${id}`, {headers}); // Envia a requisição GET para obter um paciente específico
  }


  obterPacientesPorNomeOuPorId(buscaInput: string): Observable<Paciente[]> {
    const headers = this.authService.getAuthHeaders();
    // console.log('getPacientesPorNomeOuPorId chamado com:', buscaInput);

    if (this.isNumeric(buscaInput)) {
      const url = `${this.urlPath}?id=${buscaInput}`;
      console.log('URL para busca por ID:', url);

      return this.http.get<{ pacientes: Paciente[] }>(url, { headers, observe: 'response' }).pipe(
        tap(response => {
          console.log('Status:', response.status);
          console.log('Headers:', response.headers);
          console.log('Body:', response.body);
        }),
        map(response => response.body?.pacientes || [])
      );

    } else {
      const url = `${this.urlPath}?nome=${buscaInput}`;
      console.log('URL para busca por nome:', url);

      return this.http.get<{ pacientes: Paciente[] }>(url, { headers, observe: 'response' }).pipe(
        tap(response => {
          console.log('Status:', response.status);
          console.log('Headers:', response.headers);
          console.log('Body:', response.body);
        }),
        map(response => response.body?.pacientes || [])
      );
    }
  }

  pesquisarPacientes(termo: string): Observable<any[]> {
    const headers = this.userService.getAuthHeaders(); // Obtém os cabeçalhos de autenticação
    return this.http.get<any[]>(`${this.urlPath}?search=${termo}`);
  }

  isNumeric(buscaInput: string) {
    return /^\d+$/.test(buscaInput);
  }

  obterPacientesPorNomeEmailOuTelefone(buscaInput: string): Observable<Paciente[]> {
    const headers = this.authService.getAuthHeaders();
    console.log('obterPacientesPorNomeEmailOuTelefone chamado com:', buscaInput);

    const buscaSemFormatacao = this.removerFormatacaoTelefone(buscaInput);

    let params: any = {};

    if (this.isNumeric(buscaSemFormatacao)) {
      params.telefone = buscaSemFormatacao;
    } else if (this.isEmail(buscaInput)) {
      params.email = buscaInput;
    } else {
      params.nome = buscaInput;
    }

    console.log('Parâmetros para busca:', params);

    return this.http.get<{ pacientes: Paciente[] }>(this.urlPath, { headers, params, observe: 'response' }).pipe(
      tap(response => {
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Body:', response.body);
      }),
      map(response => response.body?.pacientes || [])
    );
  }

  private isEmail(value: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  }

  private removerFormatacaoTelefone(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }


  // obterPacientes(): any[] {
  //   return JSON.parse(localStorage.getItem('pacientes') ?? '[]');
  // }

  // obterPacientePorId(id: string): any {
  //   const pacientes = this.obterPacientes();
  //   const pacienteEncontrado = pacientes.find(paciente => paciente.id === id);
  //   return pacienteEncontrado || null;
  // }


  // deletarPacientePorId(id: string) {
  //   let pacientes: any[] = this.obterPacientes();
  //   pacientes = pacientes.filter(paciente => paciente.id !== id);
  //   localStorage.setItem('pacientes', JSON.stringify(pacientes));
  // }

  // Alteração: Método atualizado para deletar um paciente específico pelo ID no backend
  deletarPacientePorId(id: string): Observable<any> {
    console.log(id)
    const headers = this.userService.getAuthHeaders(); // Obtém os cabeçalhos de autenticação
    return this.http.delete(`${this.urlPath}/${id}`, { headers }); // Envia a requisição DELETE para remover um paciente
  }

  // pesquisarPacientes(textoPesquisa: string): any[] {
  //   const pacientes = this.obterPacientes();
  //   return pacientes.filter(paciente =>
  //     paciente.nomeCompleto.toLowerCase().includes(textoPesquisa.toLowerCase()) ||
  //     paciente.telefone.includes(textoPesquisa) ||
  //     paciente.email.includes(textoPesquisa) ||
  //     paciente.id === textoPesquisa
  //   );
  // }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Detalhes do erro:', error);
    if (error.error instanceof ErrorEvent) {
      // Erros do lado do cliente ou de rede
      console.error('Erro do lado do cliente:', error.error.message);
    } else {
      // Erros retornados pelo backend
      console.error(
        `Backend retornou o código ${error.status}, ` +
        `corpo do erro: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(() => new Error('Ocorreu um erro ao processar a requisição. Verifique os detalhes e tente novamente.'));
  }

}