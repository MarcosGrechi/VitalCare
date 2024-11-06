import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserStorageService } from '../../../services/users-storage.service';
import { User } from '../../../entities/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-singup',
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
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.scss',
})
export class SingupComponent {
  constructor(
    public dialogRef: MatDialogRef<SingupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly usersService: UserStorageService,
    private snackBar: MatSnackBar
  ) { }

  user: User | undefined;

  email: string | null | undefined;
  nomePerfil: string | null | undefined;
  password: string | null | undefined;
  confirmPassword: string | null | undefined;

  signupForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      nomePerfil: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    },
    { validators: this.passwordMatchValidator } // Adiciona o validador personalizado
  );

  // Validador personalizado para confirmar se as senhas coincidem
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.signupForm.invalid) {
      // Verifica o erro `passwordMismatch` no formulário
      if (this.signupForm.hasError('passwordMismatch')) {
        this.snackBar.open('As senhas não coincidem!', 'Fechar', {
          duration: 3000,
          panelClass: ['mat-snack-bar-error'], // Classe CSS opcional para personalização
          verticalPosition: 'top',
        });
      }
      return;
    }
  
    const formData = this.signupForm.value;
    this.usersService.addUser(formData).subscribe({
      next: (response) => {
        this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
        });
        console.log("Usuário cadastrado com sucesso: ", response);
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Erro ao cadastrar usuário: ', err);
        this.snackBar.open('Erro ao cadastrar usuário!', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    });
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }
}