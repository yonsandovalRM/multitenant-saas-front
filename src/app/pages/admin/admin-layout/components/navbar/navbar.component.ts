import { AuthService } from '@/services/auth.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  toggleSidebar() {
    console.log('toggleSidebar');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
