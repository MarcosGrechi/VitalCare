import { Injectable } from '@angular/core';
import { AuthService } from './authservice.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { apiUrl } from '../environments/environment';
import { Exame } from '../entities/exame.model';
import { Consulta } from '../entities/consulta.model';

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {

  urlPath: string = `${apiUrl}/pacientes`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}
  

  getProntuarioDePaciente(id: string): Observable<Exame[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Exame[]>(`${this.urlPath}/${id}/prontuarios`, { headers });
  }

  getExamesPaciente(id: string): Observable<Exame[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<{ exames: Exame[] }>(`${this.urlPath}/${id}/prontuarios`, { headers }).pipe(
      map(response => response.exames)
    );
  }

  getConsultasPaciente(id: string): Observable<Consulta[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<{ consultas: Consulta[] }>(`${this.urlPath}/${id}/prontuarios`, { headers }).pipe(
      map(response => response.consultas)
    );
  }

  getTodosProntuarios(): Observable<Exame[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Exame[]>(this.urlPath, { headers });
  }

}
