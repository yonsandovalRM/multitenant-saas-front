import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '@/models/user';
import { AuthService } from '@/services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Suscribirse al observable del usuario
    this.userSubscription = this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    // Si no hay usuario en el observable, intentar obtener el perfil
    if (!this.user && this.authService.isAuthenticated()) {
      this.authService.getProfile().subscribe({
        next: (userProfile) => {
          this.user = userProfile as User;
        },
        error: (error) => {
          console.error('Error getting user profile:', error);
        },
      });
    }
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    // Aquí podrías redirigir al login
    this.router.navigate(['/login']);
  }
}
