import { Component } from '@angular/core';
import { User } from '../../helpers/models/user';
import { AuthService } from '../../helpers/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: User | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe((userProfile) => {
      this.user = userProfile as User;
    });
  }
}
