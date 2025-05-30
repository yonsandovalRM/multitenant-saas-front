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
import { AuthService, AuthResponse } from '../../helpers/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

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
    private readonly router: Router
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
          console.log('Registration successful:', response);
          this.isLoading = false;
          this.successMessage = 'Registro exitoso. Redirigiendo...';

          // Redirigir después de un breve delay para mostrar el mensaje
          setTimeout(() => {
            this.router.navigateByUrl('/dashboard');
          }, 2000);
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.isLoading = false;

          // Manejo específico de errores
          if (err.status === 400) {
            this.errorMessage =
              'Datos inválidos. Verifica la información ingresada.';
          } else if (err.status === 409) {
            this.errorMessage =
              'Este email ya está registrado. Intenta con otro email.';
          } else if (err.status === 422) {
            this.errorMessage =
              'Error de validación. Verifica que todos los campos sean correctos.';
          } else {
            this.errorMessage =
              'Error al registrarse. Intenta de nuevo más tarde.';
          }
        },
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      this.registerForm.markAllAsTouched();
    }
  }
}
