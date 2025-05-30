import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getToken();
  const tenantId = authService.getTenantId();

  let authReq = req;

  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (tenantId) {
    authReq = authReq.clone({
      setHeaders: {
        ...authReq.headers,
        'X-TENANT-ID': tenantId,
      },
    });
  }

  return next(authReq);
};
