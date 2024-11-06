import { Component } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SingupComponent } from './singup/singup.component';
import { UserStorageService } from '../../services/users-storage.service';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup; 
  loginFailed: boolean = false;

  constructor(
    public dialog: MatDialog,
    private readonly userService: UserStorageService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  openDialog(): void {
    this.dialog.open(SingupComponent, {
      width: '260px', 
    });
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}


login() {
  if (this.loginForm.invalid) {
    return;
  }

  const email = this.loginForm.value.email as string;
  const password = this.loginForm.value.password as string;

  this.authService.login({ email, password }).subscribe({
    next: (response) => {
      if (response?.token) {
        this.userService.setToken(response.token);
        // console.log('Resposta do login:', response);

        // Decodificar o token para obter informações do paciente
        const decodedToken = this.decodeToken(response.token);
        // console.log('Token decodificado:', decodedToken);

        const perfil = response.listaNomesPerfis && response.listaNomesPerfis.length > 0
          ? response.listaNomesPerfis[0]
          : '';

        this.userService.setProfile(perfil);

        // Verificar se o perfil é "PACIENTE" e redirecionar usando o `pacienteId`
        if (perfil === 'PACIENTE' && decodedToken.pacienteId) {
          const idPaciente = decodedToken.pacienteId;
          // console.log('Redirecionando para o prontuário do paciente com ID:', idPaciente);
          this.router.navigate(['prontuario-paciente', idPaciente]);
        } else if (perfil !== 'PACIENTE') {
          // console.log('Redirecionando para a home para o perfil:', perfil);
          this.router.navigate(['home']);
        } else {
          console.error('Erro: pacienteId não encontrado no token.');
          this.snackBar.open("Erro ao redirecionar. ID do paciente não encontrado.", 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      } else {
        console.error("Resposta de login inválida: ", response);
        this.loginFailed = true;
        this.snackBar.open("Erro ao fazer login. Tente novamente.", 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    },
    error: (error) => {
      this.snackBar.open("Usuário ou senha inválidos", 'Fechar', {
        duration: 3000,
        verticalPosition: 'top',
      });
      console.error("Erro ao fazer o login", error);
      this.loginFailed = true;
    }
  });
}




  
  
  forgotPassword() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '260px', 
    });
  }
}
