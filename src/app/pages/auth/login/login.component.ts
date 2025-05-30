import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { AuthService, AuthResponse } from '@/services/auth.service';
import { ToastService } from '@/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Verificar si el usuario llegó aquí por sesión expirada
    this.route.queryParams.subscribe((params) => {
      if (params['expired'] === 'true') {
        this.errorMessage =
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      }
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response: AuthResponse) => {
          this.toastService.showToast(
            'success',
            'Inicio de sesión exitoso',
            'Bienvenido nuevamente, ' + response.user.name
          );
          this.isLoading = false;
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          this.isLoading = false;
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        },
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.loginForm.markAllAsTouched();
    }
  }
}
