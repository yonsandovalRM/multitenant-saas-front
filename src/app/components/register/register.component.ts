import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../helpers/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register(name, email, password).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
