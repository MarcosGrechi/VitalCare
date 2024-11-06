import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { PageTitleService } from '../../services/title.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PacientesService } from '../../services/pacientes.service';
import { CommonModule } from '@angular/common';
import { FormatarTelefonePipe } from '../../pipes/formatar-telefone.pipe';
import { Exame } from '../../entities/exame.model';
import { Consulta } from '../../entities/consulta.model';
import { ProntuarioService } from '../../services/prontuario.service';
import { Paciente } from '../../entities/paciente.model';
import { HorarioPipe } from '../../pipes/horario.pipe';
@Component({
    selector: 'app-prontuario-paciente',
    standalone: true,
    templateUrl: './prontuario-paciente.component.html',
    styleUrl: './prontuario-paciente.component.scss',
    imports: [
        RouterLink,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatIcon,
        CommonModule,
        FormatarTelefonePipe,
        HorarioPipe
    ]
})
export class ProntuarioPacienteComponent {
  paciente: Paciente | undefined;
  consultas: Consulta[] = [];
  exames: Exame[] = [];
  exame: Exame | undefined;

  colunasConsultas: string[] = ['data', 'hora', 'motivo', 'editar'];
  colunasExames: string[] = ['data', 'hora', 'nome', 'laboratorio', 'editar'];

  constructor(
    private readonly pageTitleService: PageTitleService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly pacientesService: PacientesService,
    private readonly prontuarioService: ProntuarioService
  ) {
    this.pageTitleService.setPageTitle('PRONTUÁRIO DE PACIENTE');
  }
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const pacienteId = params['id'];
      this.obterDadosPaciente(pacienteId);
      this.obterConsultas(pacienteId);
      this.obterExames(pacienteId);
    });
  }

  obterDadosPaciente(pacienteId: string): void {
    this.pacientesService.obterPacientesPorNomeOuPorId(pacienteId).subscribe((pacientes: Paciente[]) => {
      this.paciente = pacientes[0];
      // console.log('Paciente recebido:', this.paciente);
    });
  }

  obterConsultas(pacienteId: string): void {
    this.prontuarioService.getConsultasPaciente(pacienteId).subscribe((consultas: Consulta[]) => {
      this.consultas = consultas;
      // console.log('Consultas recebidos:', this.consultas);
    });
  }

  obterExames(pacienteId: string): void {
    this.prontuarioService.getExamesPaciente(pacienteId).subscribe((exames: Exame[]) => {
      this.exames = exames;
      // console.log('Exames recebidos:', this.exames);
    });
  }

  editarConsulta(consulta: Consulta) {
    const idConsulta = consulta.id;
    this.router.navigate(['/cadastro-consulta', idConsulta]);
  }
         
  editarExame(exame: Exame) {
    const idExame = exame.id;
    this.router.navigate(['/cadastro-exames', idExame]);
  }

}

