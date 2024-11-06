import { Component, Input } from "@angular/core";
import { Paciente } from "../../../entities/paciente.model";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { IdadePipe } from "../../../pipes/idade.pipe";
import { FormatarTelefonePipe } from "../../../pipes/formatar-telefone.pipe";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-card-info-pacientes',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    IdadePipe,
    FormatarTelefonePipe,
    CommonModule
  ],
  templateUrl: './card-info-pacientes.component.html',
  styleUrls: ['./card-info-pacientes.component.scss']
})
export class CardInfoPacientesComponent {
  @Input() paciente: Paciente | null = null;

  constructor(private router: Router) {}

  verMais(idPaciente: string): void {
    this.router.navigate(['prontuario-paciente', idPaciente]);
  }
}
