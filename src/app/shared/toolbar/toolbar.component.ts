import { AfterContentInit, Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserStorageService } from '../../services/users-storage.service';
import { PageTitleService } from '../../services/title.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoginResponse } from '../../entities/auth.models';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  loggedUser: any;

  pageTitle: string = '';

  private titleSubscription: Subscription | undefined;

  constructor(
    private readonly userService: UserStorageService,
    private readonly pageTitleService: PageTitleService,
    private readonly router: Router
  ) {
    this.pageTitleService.getPageTitle().subscribe((title) => {
      this.pageTitle = title;
    });
  }

  ngOnInit() {
    this.loggedUser = this.userService.getLoggedUser();
    console.log('Usuário logado:', this.loggedUser); // Log para depuração
    if (!this.loggedUser || Array.isArray(this.loggedUser) && this.loggedUser.length === 0) {
      this.router.navigate(['/login']);
      return;
    }
    const nomeUsuario = this.loggedUser?.nome ?? this.loggedUser?.email;
    this.loggedUser = { ...this.loggedUser, nome: nomeUsuario };
  
    
    // this.titleSubscription = this.pageTitleService.getPageTitle().subscribe(title => {
    //   this.pageTitle = title;
    // });
  }

  editarUsuario(usuario: any) {
    this.router.navigate(['/usuarios', usuario.usuarioId]);
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }
}
