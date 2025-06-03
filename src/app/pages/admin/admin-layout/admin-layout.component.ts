import { AuthService } from '@/services/auth.service';
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
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
