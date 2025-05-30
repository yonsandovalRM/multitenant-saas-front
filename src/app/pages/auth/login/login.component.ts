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

          // Manejo específico de errores
          if (err.status === 401) {
            this.toastService.showToast(
              'error',
              'Credenciales incorrectas',
              'Verifica tu email y contraseña.'
            );
          } else if (err.status === 403) {
            this.toastService.showToast(
              'error',
              'Acceso denegado',
              'Tu cuenta puede estar deshabilitada.'
            );
          } else {
            this.toastService.showToast(
              'error',
              'Error al iniciar sesión',
              'Verifica tu conexión e intenta de nuevo.'
            );
          }
        },
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.loginForm.markAllAsTouched();
    }
  }
}
