import { Injectable } from '@angular/core';
import { apiUrl } from '../environments/environment';
import { AuthService } from './authservice.service';
import { map, Observable } from 'rxjs';
import { Consulta } from '../entities/consulta.model';
import { Paciente } from '../entities/paciente.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  urlPath: string = `${apiUrl}/consultas`;
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  salvarConsulta(consulta: Consulta): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(this.urlPath, consulta, { headers });
  }
  // gerarIdConsulta(): string {
  //   const consultas = this.obterConsultas();
  //   const proximoId = consultas.length + 1;
  //   return `C${proximoId.toString().padStart(6, '0')}`;
  // }
  
  obterConsultas(): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Consulta[]>(this.urlPath, { headers });
  }

  // obterConsultasPorId(idPaciente: string): Observable<any> {
  //   const headers = this.authService.getAuthHeaders();
  //   return this.http.get(`${this.urlPath}/${idPaciente}`, { headers });
  // }

  obterConsultaPorId(idConsulta: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.urlPath}/${idConsulta}`, { headers });
  }
  
  obterQuantidadeConsultas(): Observable<number> {
    const headers = this.authService.getAuthHeaders();
    const quantidadeConsultas = this.http.get<Consulta[]>(this.urlPath, { headers }).pipe(
      map((listaConsultas: Consulta[]) => listaConsultas.length)
    );
    return quantidadeConsultas;
    //return this.obterConsultas().length;
  }

  deletarConsulta(id: string) {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.urlPath}/${id}`, { headers });
    // let consultas: any[] = this.obterConsultas();
    // const index = consultas.findIndex(consulta => consulta.idConsulta === id);
    // if (index !== -1) {
    //   consultas.splice(index, 1); 
    //   localStorage.setItem('consultas', JSON.stringify(consultas));
    // } else {
    //   console.error('Consulta não encontrada para deletar.');
    // }
  }

  atualizarConsulta(id: string, consultaAtualizada: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put(`${this.urlPath}/${id}`, consultaAtualizada, { headers });
    // let consultas: any[] = this.obterConsultas();
    // const index = consultas.findIndex(consulta => consulta.idConsulta === consultaAtualizada.idConsulta);
    // if (index !== -1) {
    //   consultas[index] = consultaAtualizada;
    //   localStorage.setItem('exames', JSON.stringify(consultas));
    // } else {
    //   console.error('Exame não encontrado para atualizar.');
    // }
  }
  
}

