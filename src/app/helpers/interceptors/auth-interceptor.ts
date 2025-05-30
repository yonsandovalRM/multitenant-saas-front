import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const tenantId = authService.getTenantId();

  let authReq = req;

  // Agregar token de autorización si existe
  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Agregar tenant ID si existe
  if (tenantId) {
    authReq = authReq.clone({
      setHeaders: {
        ...authReq.headers,
        'X-TENANT-ID': tenantId,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejo específico de errores 401 (No autorizado)
      if (error.status === 401) {
        console.warn('Token expirado o inválido. Cerrando sesión...');

        // Cerrar sesión y limpiar datos
        authService.logout();

        // Redirigir al login
        router.navigate(['/login'], {
          queryParams: { expired: 'true' },
        });
      }

      // Re-lanzar el error para que otros componentes puedan manejarlo si es necesario
      return throwError(() => error);
    })
  );
};
