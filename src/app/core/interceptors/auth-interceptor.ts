import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '@/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const tenantId = authService.getTenantId();

  let modifiedReq = req;

  if (token) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (tenantId) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        ...modifiedReq.headers,
        'X-TENANT-ID': tenantId,
      },
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('error', error);

      if (error.status === 0) {
        console.error(
          'Error de conexión a Internet o servidor no disponible.',
          error,
        );
      } else if (error.status === 401 || error.status === 403) {
        console.warn(
          'Sesión expirada o no autorizado. Limpiando sesión y redirigiendo.',
        );
        authService.handleSessionExpired();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
