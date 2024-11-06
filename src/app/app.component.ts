import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterLink } from '@angular/router';
import { MenuLateralComponent } from "./shared/menu-lateral/menu-lateral.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatList, MatNavList } from '@angular/material/list';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
      RouterOutlet,
      MenuLateralComponent,
      RouterLink,
      RouterOutlet,
      MatIconModule,
      MatButtonModule,
      MatSidenavModule,
      MatNavList,
      MatList,
      ToolbarComponent,
      CommonModule
    ]
})
export class AppComponent {
  title = 'LABMedical';

  isLogged = false;

  constructor(private readonly router: Router) {
    router.events.subscribe(evento => {
      if (evento instanceof NavigationEnd) {
        this.isLogged = evento.urlAfterRedirects != '/login';
      }
    });
  }
  
  
}
