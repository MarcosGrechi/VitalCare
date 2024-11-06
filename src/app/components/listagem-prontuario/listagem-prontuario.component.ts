import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageTitleService } from '../../services/title.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { PacientesService } from '../../services/pacientes.service';
import { Router } from '@angular/router';
import { Paciente } from '../../entities/paciente.model';

@Component({
  selector: 'app-listagem-prontuario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
  ],
  templateUrl: './listagem-prontuario.component.html',
  styleUrl: './listagem-prontuario.component.scss',
})
export class ListagemProntuarioComponent implements OnInit {
  displayedColumns: string[] = ['registro', 'nomePaciente', 'convenio', 'acao'];
  pacientes: Paciente[] = [];
  textoPesquisa: any;

  constructor(
    private readonly pageTitleService: PageTitleService,
    private readonly pacientesService: PacientesService,
    private readonly router: Router
  ) {
    this.pageTitleService.setPageTitle('LISTAGEM DE PRONTUÁRIO');
  }

  ngOnInit(): void {
    this.atualizarListaPacientes();
  }

  atualizarListaPacientes() {
    this.pacientesService.obterPacientes().subscribe(
      (pacientes) => {
        this.pacientes = pacientes;
        console.log("Lista de pacientes:", this.pacientes); // Melhorar o log para ver a resposta completa
      },
      (error) => {
        console.error("Erro ao obter pacientes:", error); // Log para capturar erros
      }
    );
  }
  

  pesquisarPacientes(textoPesquisa: string) {
    if (!textoPesquisa) {
      this.atualizarListaPacientes();
    } else {
      this.pacientesService.pesquisarPacientes(textoPesquisa).subscribe((pacientes) => {
        this.pacientes = pacientes;
      });
    }
  }

  acessarProntuario(paciente: any) {
    this.router.navigate(['/prontuario-paciente', paciente.id]);
  }

  editarPaciente(idPaciente: string) {
    this.router.navigate(['/cadastro-paciente', idPaciente]);
  }
}
