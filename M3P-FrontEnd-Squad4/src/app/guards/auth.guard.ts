import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanMatchFn,
  UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authservice.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  canMatch: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean => {
    const isAuthenticated = this.authService.isAuthenticated();
    const userProfile = this.authService.getProfiles()[0]; // Obtendo o primeiro perfil (ajuste se necessário)

    console.log('Autenticado:', isAuthenticated);
    console.log('Perfil do usuário:', userProfile);

    // Se não estiver autenticado, redirecione para a página de login
    if (!isAuthenticated) {
      console.log('Usuário não autenticado. Redirecionando para /login');
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoutes: { [key: string]: string[] } = {
      ADMIN: ['home', 'cadastro-paciente', 'cadastro-paciente/:id', 'cadastro-consulta',
        'cadastro-consulta/:consultaId', 'cadastro-exames', 'cadastro-exames/:exameId',
        'prontuario-paciente', 'prontuario-paciente/:id', 'listagem-prontuario', 'usuarios'],

      PACIENTE: ['prontuario-paciente/:id', 'cadastro-consulta/:consultaId', 'cadastro-exames/:exameId'],
      
      MÉDICO: ['home', 'cadastro-paciente', 'cadastro-paciente/:id', 'cadastro-consulta',
        'cadastro-consulta/:consultaId', 'cadastro-exames', 'cadastro-exames/:exameId',
        'prontuario-paciente', 'prontuario-paciente/:id', 'listagem-prontuario'],
    };

    const routePath = route.path;
    console.log('Rota atual:', routePath);

    // Verifica se a rota atual é permitida para o perfil do usuário
    const isAllowed = allowedRoutes[userProfile]?.some(r => this.routeMatches(r, routePath));

    if (!isAllowed) {
      console.log('Acesso negado à rota:', routePath);
      return false; // Permite que o usuário permaneça na mesma rota
    }

    console.log('Acesso permitido à rota:', routePath);
    return true; // Permite acesso se tudo estiver correto
  };

  private routeMatches(allowedRoute: string, currentRoute: string | undefined): boolean {
    console.log('Verificando rota permitida:', allowedRoute, 'com rota atual:', currentRoute);
    
    // Verifica se a rota atual corresponde à rota permitida
    if (allowedRoute.includes(':')) {
      const allowedRoutePattern = allowedRoute.replace(/:\w+/g, '([^/]+)');
      const regex = new RegExp(`^${allowedRoutePattern}$`);
      const matches = regex.test(currentRoute || '');
      console.log('Regex:', regex, 'Matches:', matches);
      return matches;
    }

    const matches = currentRoute === allowedRoute;
    console.log('Matches:', matches);
    return matches;
  }
}