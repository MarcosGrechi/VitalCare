import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../services/title.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { PacientesService } from '../../services/pacientes.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CardInfoPacientesComponent } from '../home/card-info-pacientes/card-info-pacientes.component';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ExamesService } from '../../services/exames.service';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paciente } from '../../entities/paciente.model';
import { Exame } from '../../entities/exame.model';
import { HorarioPipe } from '../../pipes/horario.pipe';

@Component({
  selector: 'app-cadastro-exames',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatLabel,
    MatIcon,
    CardInfoPacientesComponent,
    MatTable,
    MatIconModule,
    MatTableModule,
    MatDatepickerModule,
    MatDatepicker,
    CommonModule,
    HorarioPipe,
  ],
  templateUrl: './cadastro-exames.component.html',
  styleUrls: ['./cadastro-exames.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class CadastroExamesComponent implements OnInit {

  pacientes: Paciente[] = [];
  pacienteSelecionado: { id: string; nome: string } | null = null;
  displayedColumns: string[] = ['registro', 'nomePaciente', 'acao'];
  exameId: string | null = null;
  exameForm: FormGroup;
  buscaInput: string = '';
  mostrar: boolean = true;
  usersList: any[] = [];

  constructor(
    private readonly pageTitleService: PageTitleService,
    private readonly pacientesService: PacientesService,
    private readonly examesService: ExamesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.exameForm = new FormGroup({
      nome: new FormControl({ value: '', disabled: true }),
      idPaciente: new FormControl(''),
      nomeExame: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      dataExame: new FormControl('', [Validators.required]),
      horarioExame: new FormControl('', [Validators.required]),
      tipoExame: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),
      ]),
      laboratorio: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(32),
      ]),
      urlDocumento: new FormControl(''),
      resultados: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(1024),
      ]),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const exameId = params.get('exameId');
      // console.log('Rota com exameId:', exameId);
      this.exameId = exameId;
      this.mostrar = !exameId;
      if (this.exameId) {
        // this.pageTitleService.setPageTitle('EDIÇÃO DE EXAME');
        // this.cdr.detectChanges(); // Marcar para verificação de mudanças
        this.carregarExame(this.exameId);
      } else {
        // this.pageTitleService.setPageTitle('CADASTRO DE EXAME');
        // this.cdr.detectChanges(); // Marcar para verificação de mudanças
        this.atualizarListaPacientes();
      }
    });
  }

  carregarExame(id: string): void {
    this.examesService.getExamePorId(id).subscribe((exame: Exame) => {
      // console.log(exame);
      // Converte a data para o formato yyyy-MM-dd para ser compatível com o input type="date"
      const dataExame = new Date(exame.dataExame).toISOString().split('T')[0];
      // Converte o horário para o formato HH:mm para ser compatível com o input type="time"
      const horarioExame = `${exame.horarioExame[0]
        .toString()
        .padStart(2, '0')}:${exame.horarioExame[1]
        .toString()
        .padStart(2, '0')}`;

      if (exame.idPaciente) {
        this.pacientesService
          .getPacientePorId(exame.idPaciente)
          .subscribe((paciente: Paciente) => {
            // console.log('Paciente: ' + JSON.stringify(paciente));
            this.exameForm.patchValue({
              ...exame,
              dataExame: dataExame,
              horarioExame: horarioExame,
              nome: paciente.nome,
            });
            console.log(
              'Formulário atualizado com exame e paciente:',
              this.exameForm.value
            );
          });
      } else {
        console.error('ID do paciente não encontrado no exame.');
      }
    });
  }

  atualizarListaPacientes() {
    this.pacientesService.obterPacientes().subscribe((pacientes) => {
      this.pacientes = pacientes;
      // console.log("Lista de pacientes: " + pacientes);
    });
  }

  buscarPacientes(buscaInput: string): void {
    // console.log('Método buscarPacientes chamado com buscaInput:', buscaInput);
    this.pacientesService.obterPacientesPorNomeOuPorId(buscaInput).subscribe({
      next: (pacientes) => {
        // console.log('Pacientes recebidos do serviço:', pacientes);
        this.pacientes = Array.isArray(pacientes) ? pacientes : [pacientes];
        // console.log('Pacientes após processamento:', this.pacientes);
        if (this.pacientes.length === 0) {
          this.snackBar.open('Nenhum paciente encontrado com o valor: ' + buscaInput, 'OK', {
            duration: 5000,
          });
        }
      },
      error: (error) => {
        console.error('Erro ao buscar pacientes:', error);
        this.snackBar.open('Nenhum paciente encontrado com o valor: ' + buscaInput, 'OK', {
          duration: 5000,
        });
      }
    });
  }

   selecionarPaciente(paciente: any) {
    this.pacienteSelecionado = paciente;
    this.exameForm.patchValue({
      nomeCompletoPaciente: paciente.nomeCompleto,
      idPaciente: paciente.id,
    });
  }

  validarForm() {
    if (this.exameForm.valid) {
      console.log('Formulário válido');
      return true;
    } else {
      console.log('Formulário inválido');
      this.exameForm.markAllAsTouched(); // Marca todos os campos como tocados para exibir mensagens de erro
      return false;
    }
  }

  cadastrarExame() {
    if (this.validarForm()) {
      const formData = this.exameForm.value;
      this.examesService.addExame(formData).subscribe({
        next: () => {
          this.snackBar.open('Exame cadastrado com sucesso!', 'OK', {
            duration: 5000,
          });
          this.router.navigate(['home']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar exame:', err);
          this.snackBar.open(
            'Erro ao cadastrar exame. Tente novamente.',
            'OK',
            { duration: 5000 }
          );
        },
      });
    }
  }

  deletarExame() {
    if (this.exameId) {
      const snackBarRef = this.snackBar.open(
        'Tem certeza que deseja deletar esse exame?',
        'CONFIRMAR',
        {
          duration: 5000,
        }
      );

      snackBarRef.onAction().subscribe(() => {
        this.examesService.deleteExame(this.exameId!).subscribe({
          next: () => {
            this.snackBar.open('Exame deletado com sucesso!', 'OK', {
              duration: 5000,
            });
            this.router.navigate(['home']);
          },
          error: (err) => {
            console.error('Erro ao deletar exame:', err);
            this.snackBar.open(
              'Erro ao deletar exame. Tente novamente.',
              'OK',
              { duration: 5000 }
            );
          },
        });
      });
    } else {
      console.error('ID do exame não encontrado para exclusão.');
    }
  }

  editarExame(): void {
    const exameFormPreenchido = this.exameForm.value;
    this.examesService.updateExame(this.exameId!, exameFormPreenchido).subscribe({
      next: () => {
        this.snackBar.open('Exame atualizado com sucesso!', 'OK', { duration: 5000 });
      },
      error: (err) => {
        console.error('Erro ao atualizar exame:', err);
        this.snackBar.open('Erro ao atualizar exame. Tente novamente.', 'OK', { duration: 5000 });
      }
    });
  }
  
  
}