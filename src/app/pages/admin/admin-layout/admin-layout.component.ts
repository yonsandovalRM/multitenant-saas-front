import { AuthService } from '@/services/auth.service';
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {}
