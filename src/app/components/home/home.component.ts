import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLateralComponent } from "../../shared/menu-lateral/menu-lateral.component";
import { RouterOutlet } from '@angular/router';
import { CardInfoPacientesComponent } from './card-info-pacientes/card-info-pacientes.component';
import { CardEstatisticasComponent } from './card-estatisticas/card-estatisticas.component';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { PageTitleService } from '../../services/title.service';
import { MatDividerModule } from '@angular/material/divider';
import { UserStorageService } from '../../services/users-storage.service';
import { DashboardService } from '../../services/dashboard.service';
import { PacientesService } from '../../services/pacientes.service';
import { Router } from '@angular/router';
import { Paciente } from '../../entities/paciente.model';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    MenuLateralComponent,
    RouterOutlet,
    CardInfoPacientesComponent,  
    CardEstatisticasComponent,
    CommonModule,
    MatIcon,
    MatLabel,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDividerModule   
  ]
})
export class HomeComponent implements OnInit {
  
  pacientes: Paciente[] = [];
  quantidadePacientes: number = 0;
  textoPesquisa: string = '';
  quantidadeExames: number = 0;
  quantidadeConsultas: number = 0;
  quantidadeUsuarios: number = 0;
  profile: string | undefined;

  constructor(
    private dashboardService: DashboardService,
    private userService: UserStorageService,
    private pageTitleService: PageTitleService,
    private pacientesService: PacientesService,
    private router: Router // Injetando o Router
  ) {
    this.pageTitleService.setPageTitle('ESTATÍSTICAS E INFORMAÇÕES');
  }
  
  ngOnInit(): void {
    this.profile = this.userService.getProfile();

    // Se o usuário for paciente, redirecionar para seu prontuário
    if (this.profile === 'PACIENTE') {
      const userId = this.userService.getLoggedUser().id; // Presumindo que o ID do usuário esteja armazenado
      this.router.navigate(['prontuario-paciente', userId]); // Ajuste a rota conforme necessário
    } else {
      this.carregarDadosDoDashboard();
      this.atualizarListaPacientes();
    }
  }

  atualizarListaPacientes() {
    this.pacientesService.obterPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
        this.quantidadePacientes = this.pacientes.length;
      },
      error: (error) => {
        console.error('Erro ao obter pacientes', error);
      }
    });
  }

  carregarDadosDoDashboard(): void {
    this.dashboardService.getDashboardData().subscribe(
      (data) => {            
        this.quantidadePacientes = data.numeroPacientes;
        this.quantidadeConsultas = data.numeroConsultas;
        this.quantidadeExames = data.numeroExames;
        this.quantidadeUsuarios = data.numeroUsuarios;
      },
      (error) => {
        console.error('Erro ao carregar dados do dashboard', error);
      }
    );
  }

  pesquisarPacientes(textoPesquisa: string) {
    if (!textoPesquisa) {
      this.atualizarListaPacientes();
    } else {
      this.pacientesService.obterPacientesPorNomeEmailOuTelefone(textoPesquisa).subscribe((pacientes) => {
        this.pacientes = pacientes;
      });
    }
  }
}