import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatList, MatNavList } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { UserStorageService } from '../../services/users-storage.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../entities/auth.models';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatNavList,
    MatList,
    MatDividerModule,
    CommonModule
  ],
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
})
export class MenuLateralComponent implements OnInit {
  profile: string = '';
  isLoggedIn: boolean = false;
  loggedUser!: LoginResponse;

  constructor(
    private userService: UserStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profile = this.userService.getProfile().toLowerCase();
    this.loggedUser = this.userService.getLoggedUser();
    console.log('Usuário logado:', this.loggedUser); // Log para depuração
    if (!this.loggedUser || Array.isArray(this.loggedUser) && this.loggedUser.length === 0) {
      this.router.navigate(['/login']);
      return;
    }
}


  removeLoggedUser(): void {
    this.userService.removeLoggedUser();
    this.router.navigate(['/login']);
  }
}
