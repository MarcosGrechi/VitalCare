import { Injectable } from '@angular/core';
import { apiUrl } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './authservice.service';
import { Exame } from '../entities/exame.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamesService {
  urlPath: string = `${apiUrl}/exames`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  addExame(exame: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(this.urlPath, exame, { headers });
  };

  getExames(): Observable<Exame[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Exame[]>(this.urlPath, { headers });
  }

  getExamePorId(id: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get(`${this.urlPath}/${id}`, { headers });
  }

  updateExame(id: string, exame: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    // console.log("Exame: " + exame);
    return this.http.put(`${this.urlPath}/${id}`, exame, { headers });
  }

  deleteExame(id: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.urlPath}/${id}`, { headers });
  }

  obterQuantidadeExames(): Observable<number> {
    const headers = this.authService.getAuthHeaders();
    const quantidadeExames = this.http.get<Exame[]>(this.urlPath, { headers }).pipe(
      map((listaExames: Exame[]) => listaExames.length)
    );
    return quantidadeExames;
  }

}