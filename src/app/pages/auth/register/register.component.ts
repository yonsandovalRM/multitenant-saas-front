import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AuthService, AuthResponse } from '@/services/auth.service';
import { ToastService } from '@/services/toast.service';

// Validador personalizado para confirmar contraseña
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  register() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { name, email, password } = this.registerForm.value;

      this.authService.register(name, email, password).subscribe({
        next: (response: AuthResponse) => {
          this.toastService.showToast(
            'success',
            'Registro exitoso',
            'Inicia sesión para continuar'
          );
          this.isLoading = false;
          this.successMessage = 'Registro exitoso. Redirigiendo...';

          // Redirigir después de un breve delay para mostrar el mensaje
          setTimeout(() => {
            this.router.navigateByUrl('/dashboard');
          }, 2000);
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.registerForm.markAllAsTouched();
    }
  }
}
