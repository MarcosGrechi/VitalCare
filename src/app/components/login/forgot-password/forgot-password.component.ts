import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserStorageService } from '../../../services/users-storage.service';
import { SingupComponent } from '../singup/singup.component';
import { User } from '../../../entities/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  constructor(
    public dialogRef: MatDialogRef<SingupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly usersService: UserStorageService,
    private snackBar: MatSnackBar
  ) {}

  users: User[] | undefined;
  email: string | null | undefined;
  profile: string | null | undefined;
  password: string | null | undefined;
  confirmPassword: string | null | undefined;

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required,
      Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  submit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value as string;
      const password = this.forgotPasswordForm.get('password')?.value as string;
  
      this.usersService.getUsersByEmailOrById(email).subscribe((user: User) => {
        if (user) {
          this.usersService.updatePassword(email, password).subscribe({
            next: () => {
              // Substitui o alert por snackBar para sucesso
              this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
                duration: 3000,
                verticalPosition: 'top',
              });
              this.dialogRef.close();
            },
            error: () => {
              // Substitui o alert por snackBar para erro
              this.snackBar.open('Erro ao alterar senha. Tente novamente.', 'Fechar', {
                duration: 3000,
                verticalPosition: 'top',
              });
            }
          });
        } else {
          // Substitui o alert por snackBar para usuário não encontrado
          this.snackBar.open('Usuário não encontrado com o email: ' + email, 'Fechar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        }
      });
    }
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }
}
