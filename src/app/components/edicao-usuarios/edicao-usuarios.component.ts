import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PageTitleService } from '../../services/title.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStorageService } from '../../services/users-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cpfValidator } from '../../shared/validators/cpfValidator.validator';
import { formatCPF } from '../../shared/formatters/formatCpf.format';
import { formatDataNascimento } from '../../shared/formatters/formatDataNascimento.format';
import { formatTelefone } from '../../shared/formatters/formatTelefone.format';

@Component({
  selector: 'app-edicao-usuarios',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './edicao-usuarios.component.html',
  styleUrls: ['./edicao-usuarios.component.scss']
})
export class EdicaoUsuariosComponent implements OnInit {

  userId: string | null = null;

  userForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    cpf: new FormControl('', [Validators.required, cpfValidator]),
    dataNascimento: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
  });
  
  constructor(
    private readonly pageTitleService: PageTitleService,
    private readonly userService: UserStorageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly _snackBar: MatSnackBar
  ) {
    this.pageTitleService.setPageTitle('EDIÇÃO DE USUÁRIOS');
  }
    
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe(user => {
          if (user) {
            const formattedDate = user.dataNascimento ? this.formatDate(user.dataNascimento) : '';
            this.userForm.patchValue({
              nome: user.nome,
              email: user.email,
              cpf: user.cpf,
              dataNascimento: formattedDate,
              telefone: user.telefone,
            });
          }
        });
      }
    });
  }

  private formatDate(date: string): string {
    const parsedDate = new Date(date);
    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  deletarUsuario() {
    if (this.userId) {
      this.showConfirmationSnackBar();
    }
  }

  showConfirmationSnackBar() {
    const snackBarRef = this._snackBar.open('Tem certeza que deseja deletar este usuário?', 'CONFIRMAR', {
      duration: 5000
    });

    snackBarRef.onAction().subscribe(() => {
      this.userService.removeUser(this.userId!).subscribe(() => {
        this._snackBar.open('Usuário deletado com sucesso!', 'OK', {
          duration: 3000
        });
        this.router.navigate(['usuarios']);
      });
    });
  }

  salvarUsuario() {
    if (this.isFormValid()) {
      const formData = this.getFormData();
      if (this.userId) {
        this.updateUser(this.userId, formData);
      }
    }
  }

  private isFormValid(): boolean {
    return this.userForm.valid;
  }

  private getFormData(): any {
    const formData = { ...this.userForm.value };
    if (formData?.dataNascimento) {
      formData.dataNascimento = formatDataNascimento(formData.dataNascimento);
    }
    if (formData?.cpf) {
      formData.cpf = formatCPF(formData.cpf);
    }
    if (formData?.telefone) {
      formData.telefone = formatTelefone(formData.telefone);
    }
    console.log("FormData: " + JSON.stringify(formData));
    return formData;
  }

  private updateUser(userId: string, formData: any) {
    this.userService.updateUser(userId, formData).subscribe({
      next: () => {
        this._snackBar.open('Usuário atualizado com sucesso!', 'OK', { duration: 5000 });
        this.router.navigate(['usuarios']);
      },
      error: (error) => {
        this._snackBar.open('Erro ao atualizar usuário. Tente novamente.', 'OK', { duration: 5000 });
      }
    });
  }
}