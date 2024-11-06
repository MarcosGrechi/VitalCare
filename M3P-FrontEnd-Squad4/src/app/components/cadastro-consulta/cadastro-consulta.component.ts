import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PageTitleService } from '../../services/title.service';
import { MatList, MatListItem } from '@angular/material/list';
import { PacientesService } from '../../services/pacientes.service';
import {
  MAT_DATE_LOCALE,
  MatLine,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ConsultasService } from '../../services/consultas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paciente } from '../../entities/paciente.model';
import { Consulta } from '../../entities/consulta.model';
import { duration } from 'moment';

@Component({
  selector: 'app-cadastro-consulta',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIcon,
    MatButton,
    MatList,
    MatListItem,
    MatLine,
    MatIconModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatNativeDateModule,
  ],
  templateUrl: './cadastro-consulta.component.html',
  styleUrl: './cadastro-consulta.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class CadastroConsultaComponent implements OnInit {
  
  pacientes: Paciente[] = [];
  textoPesquisa: string = '';
  displayedColumns: string[] = ['registro', 'nomePaciente', 'acao'];
  pacienteSelecionado: { id: string; nome: string } | null = null;
  consultaForm: FormGroup;
  consultaId: string | null = null;
  mostrar: boolean = true;
  usersList: any[] = [];
  camposDict: { [key: string]: string } = {
    dosagemPrecaucoes: 'Dosagem e precauções',
    descricaoProblema: 'Descrição do Problema',
    horarioConsulta: 'Horário da Consulta',
    dataConsulta: 'Data da Consulta',
    motivo: 'Motivo',
  };

  constructor(
    private readonly pageTitleService: PageTitleService,
    private readonly pacientesService: PacientesService,
    private readonly consultasService: ConsultasService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.pageTitleService.setPageTitle('CADASTRO DE CONSULTA');
    this.consultaForm = new FormGroup({
      nome: new FormControl({ value: '', disabled: true }, Validators.required),
      idPaciente: new FormControl(''),
      motivo: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]),
      dataConsulta: new FormControl('', Validators.required),
      horarioConsulta: new FormControl('', Validators.required),
      descricaoProblema: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(1024),
      ]),
      medicacaoReceitada: new FormControl(''),
      dosagemPrecaucoes: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(256),
      ]),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const consultaId = params.get('consultaId');
      (this.consultaId = consultaId), (this.mostrar = !consultaId);
      if (this.consultaId) {
        this.pageTitleService.setPageTitle('EDIÇÃO DE CONSULTA');
        this.cdr.detectChanges();
        this.carregarConsulta(this.consultaId);
      } else {
        this.pageTitleService.setPageTitle('CADASTRO DE CONSULTA');
        this.cdr.detectChanges();
        this.atualizarListaPacientes();
      }
    });

    this.atualizarListaPacientes();
  }

  carregarConsulta(id: string): void {
    this.consultasService
      .obterConsultaPorId(id)
      .subscribe((consulta: Consulta) => {
        const dataConsulta = new Date(consulta.dataConsulta)
          .toISOString()
          .split('T')[0];
        const horarioConsulta = `${consulta.horarioConsulta[0]
          .toString()
          .padStart(2, '0')}:${consulta.horarioConsulta[1]
          .toString()
          .padStart(2, '0')}`;

        if (consulta.idPaciente) {
          this.pacientesService
            .getPacientePorId(consulta.idPaciente)
            .subscribe((paciente: Paciente) => {
              this.consultaForm.patchValue({
                ...consulta,
                dataConsulta: dataConsulta,
                horarioConsulta: horarioConsulta,
                nome: paciente.nome,
                paciente: paciente 
              });
            });
        } else {
          console.error('ID do paciente não encontrado na consulta.');
        }
        // this.consultaForm.patchValue({
        //   ...consulta,
        //   dataConsulta: dataConsulta,
        //   horarioConsulta: horarioConsulta,
        // });
        // console.log(this.consultaForm)
      });

    // const consulta = this.consultasService.obterConsultaPorId(this.consultaId);
    // console.log(consulta)
    // if (consulta) {
    //   this.consultaForm.patchValue(consulta);
    //   this.consultaForm.get('nome')?.disable();
    //   // this.pacienteSelecionado.nomeCompleto = consulta.paciente.nome;
    //   // this.consultaForm.get('nomeCompletoPaciente')?.disable();
    // } else {
    //   console.error('Consulta não encontrada');
    // }
  }

  atualizarListaPacientes() {
    this.pacientesService.obterPacientes().subscribe((pacientes) => {
      this.pacientes = pacientes;
    });
  }

  // pesquisarPacientes() {
  //   const textoPesquisa = this.textoPesquisa.trim();
  //   if (!textoPesquisa) {
  //     this.atualizarListaPacientes();
  //   } else {
  //     this.pacientes = this.pacientesService.pesquisarPacientes(textoPesquisa);
  //     this.pacienteSelecionado = null;
  //   }
  // }

  pesquisarPacientes(textoPesquisa: string): void {
    this.pacientesService
      .obterPacientesPorNomeOuPorId(textoPesquisa)
      .subscribe({
        next: (pacientes) => {
          this.pacientes = Array.isArray(pacientes) ? pacientes : [pacientes];
          if (this.pacientes.length === 0) {
            this.snackBar.open(
              'Nenhum paciente encontrado com o valor: ' + textoPesquisa,
              'OK',
              {
                duration: 5000,
              }
            );
          }
        },
        error: (error) => {
          console.error('Erro ao buscar pacientes', error);
          this.snackBar.open(
            'Nenhum paciente encontrado com o valor: ' + textoPesquisa,
            'OK',
            {
              duration: 5000,
            }
          );
        },
      });
    // const buscaInput = this.textoPesquisa;
    // this.pacientesService.getPacientesPorEmailOuPorId(buscaInput).subscribe(pacientes => {
    //   this.pacientes = Array.isArray(pacientes) ? pacientes : [pacientes];
    // });
  }

  selecionarPaciente(paciente: any) {
    this.pacienteSelecionado = paciente;
    this.consultaForm.patchValue({
      nome: this.pacienteSelecionado?.nome,
      idPaciente: this.pacienteSelecionado?.id,
    });
    console.log(this.consultaForm)
  }

  validarForm() {
    if (this.consultaForm.valid) {
      console.log('Formulário válido');
      return true;
    } else {
      console.log('Formulário inválido');
      this.consultaForm.markAllAsTouched();
      return false;
    }
  }

  cadastrarConsulta() {
    if (this.validarForm()) {
      const formData = this.consultaForm.value;
      this.consultasService.salvarConsulta(formData).subscribe({
        next: () => {
          this.snackBar.open('Consulta cadastrada com sucesso!', 'OK', {
            duration: 5000,
          });
          this.router.navigate(['home']);
        },
        error: (err: any) => {
          console.error('Erro ao cadastrar consulta:', err);
          this.snackBar.open(
            'Erro ao cadastrar consulta. Tente novamente.',
            'OK',
            { duration: 5000 }
          );
        },
      });
    }
  }

  deletarConsulta() {
    if (this.consultaId) {
      const snackBarRef = this.snackBar.open(
        'Tem certeza que deseja deletar essa consulta?',
        'CONFIRMAR',
        { duration: 5000 }
      );

      snackBarRef.onAction().subscribe(() => {
        this.consultasService.deletarConsulta(this.consultaId!).subscribe({
          next: () => {
            this.snackBar.open('Consulta deletada com sucesso!', 'OK', {
              duration: 3000,
            });
            this.router.navigate(['home']);
          },
          error: (err: any) => {
            console.error('Erro ao deletar consulta:', err);
            this.snackBar.open(
              'Erro ao deletar consulta. Tente novamente.',
              'OK',
              { duration: 3000 }
            );
          },
        });
      });
    } else {
      console.error('ID da consulta não encontrado para exclusão.');
    }
  }

  editarConsulta() {
    const consultaFormPreenchido = this.consultaForm.value;
    this.consultasService
      .atualizarConsulta(this.consultaId!, consultaFormPreenchido)
      .subscribe({
        next: () => {
          this.snackBar.open('Consulta atualizada com sucesso', 'OK', {
            duration: 5000,
          });
        },
        error: (err: any) => {
          console.error('Erro ao atualizar consulta: ', err);
          this.snackBar.open(
            'Erro ao atualizar consulta. Tente novamente',
            'OK',
            { duration: 5000 }
          );
        },
      });
  }

  // checarFormErros(nomeCampo: string) {
  //   const campo = this.consultaForm.get(nomeCampo);
  //   const campoNomeAjeitado = this.camposDict[nomeCampo] || nomeCampo;
  //   let mensagem: string = campoNomeAjeitado;
  //   if (campo && campo.touched && campo.errors) {
  //     if (campo.errors['required']) {
  //       mensagem += ' é obrigatório \n';
  //       // this.snackBar.open(`${campoNomeAjeitado} é obrigatório`, 'Fechar', {duration: 5000} )
  //     } else if (campo.errors['minlength']) {
  //       mensagem +=
  //         ' precisa ter no mínimo ' +
  //         campo.errors['minlength']?.requiredLength +
  //         ' caracteres';
  //       // this.snackBar.open(`${campoNomeAjeitado} precisa ter de ${campo.errors['minLength']?.requiredLength} a ${campo.errors['maxLength']?.requiredLength} caracteres`)
  //     } else if (campo.errors['maxlength']) {
  //       mensagem +=
  //         ' pode ter no máximo ' +
  //         campo.errors['maxlength']?.requiredLength +
  //         ' caracteres.';
  //     }
  //     this.snackBar.open(mensagem, 'Fechar', { duration: 5000 });
  //   }
  // }
}
