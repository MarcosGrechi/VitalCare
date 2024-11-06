import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  isLogged: boolean = false;
  token: string | null = null;
  urlPath: string = `${apiUrl}/login`;

  constructor(private readonly http: HttpClient) {}

  login(credentials: { email: string, password: string }): Observable<{ token: string, tempoExpiracao: number }> {
    return this.http.post<{ token: string, tempoExpiracao: number }>(this.urlPath, credentials);
  }

}
