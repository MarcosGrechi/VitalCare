import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { UserStorageService } from '../../../services/users-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-estatisticas',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIcon,
    MatIconModule,
    MatLabel,
    MatFormField,
    CommonModule
  ],
  templateUrl: './card-estatisticas.component.html',
  styleUrl: './card-estatisticas.component.scss'
})

export class CardEstatisticasComponent {

  constructor(
    private userService: UserStorageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.profile = this.userService.getProfile().toLowerCase();
}


  @Input() quantidadePacientes: number | undefined;
  @Input() quantidadeExames: number | undefined;
  @Input() quantidadeConsultas: number | undefined;
  @Input() quantidadeUsuarios: number | undefined;
  @Input() profile: string | undefined;
}
