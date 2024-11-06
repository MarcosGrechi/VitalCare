import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { apiUrl } from '../environments/environment';
import { LoginResponse } from '../entities/auth.models';
import { Router } from '@angular/router';
import { UserStorageService } from './users-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private token: string | null = null;
  private profiles: string[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly userService: UserStorageService
  ) { }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token); // armazena o token
        if (response.listaNomesPerfis && response.listaNomesPerfis.length > 0) {
          this.setProfile(response.listaNomesPerfis[0]); // armazena o perfil
        }
        this.userService.setLoggedUser(response); // Armazena o usuário logado


        // Logs para verificar o que está sendo armazenado
        console.log('Token armazenado:', localStorage.getItem('token'));
        console.log('Perfis armazenados:', this.getProfiles());
      })
    );
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    } else {
      console.error('Nenhum token encontrado!');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  setProfiles(profiles: string[]): void {
    this.profiles = profiles;
  }

  getProfiles(): string[] {
    return this.profiles;
  }

  setProfile(profile: string): void {
    this.profiles = [profile];
  }

  logout(): void {
    this.token = null;
    this.profiles = [];
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.userService.setLoggedUser([]); // Limpar o usuário logado
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return true;
  }
}
