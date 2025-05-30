import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '@/services/toast.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    retry(1), // Reintenta la petición una vez antes de fallar
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error del cliente: ${error.error.message}`;
        console.error('Error del cliente:', error.error.message);
      } else {
        // Error del lado del servidor
        errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
        console.error(
          `Código de error: ${error.status}, Mensaje: ${error.message}`
        );

        // Manejo específico según el código de estado
        handleServerError(error, router);
      }

      // Mostrar notificación al usuario
      showErrorMessage(toastService, errorMessage, error.status);

      return throwError(() => error);
    })
  );
};

function handleServerError(error: HttpErrorResponse, router: Router): void {
  switch (error.status) {
    case 400:
      console.error(
        'Solicitud incorrecta (400):',
        error.error?.message || 'Datos inválidos'
      );
      break;

    case 401:
      console.error('No autorizado (401) - Sesión expirada');
      // Limpiar datos de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      sessionStorage.clear();
      // Redirigir al login
      router.navigate(['/auth/login'], {
        queryParams: { returnUrl: router.url, reason: 'session-expired' },
      });
      break;

    case 403:
      console.error('Acceso prohibido (403) - Sin permisos suficientes');
      // Opcional: redirigir a página de acceso denegado
      // router.navigate(['/access-denied']);
      break;

    case 404:
      console.error('Recurso no encontrado (404)');
      break;

    case 422:
      console.error(
        'Datos no procesables (422):',
        error.error?.errors || error.error?.message
      );
      break;

    case 429:
      console.error('Demasiadas peticiones (429) - Rate limit excedido');
      break;

    case 500:
      console.error('Error interno del servidor (500)');
      break;

    case 502:
      console.error('Bad Gateway (502) - Servidor no disponible');
      break;

    case 503:
      console.error('Servicio no disponible (503) - Mantenimiento');
      break;

    case 504:
      console.error('Gateway Timeout (504) - Tiempo de espera agotado');
      break;

    default:
      console.error(`Error no manejado: ${error.status} - ${error.statusText}`);
      break;
  }
}

function showErrorMessage(
  toastService: ToastService,
  message: string,
  statusCode?: number
): void {
  // Mensaje personalizado según el código de error
  let userMessage = '';

  switch (statusCode) {
    case 400:
      if (message.includes('login')) {
        userMessage = 'Credenciales incorrectas. Verifica tus datos de acceso.';
      } else {
        userMessage =
          'Los datos enviados no son válidos. Verifica la información.';
      }
      break;
    case 401:
      userMessage =
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      break;
    case 403:
      userMessage = 'No tienes permisos para realizar esta acción.';
      break;
    case 404:
      userMessage = 'El recurso solicitado no fue encontrado.';
      break;
    case 422:
      userMessage =
        'Los datos enviados no son válidos. Verifica la información.';
      break;
    case 429:
      userMessage =
        'Has realizado demasiadas peticiones. Espera un momento antes de intentar nuevamente.';
      break;
    case 500:
      userMessage = 'Error interno del servidor. Intenta nuevamente más tarde.';
      break;
    case 502:
    case 503:
    case 504:
      userMessage =
        'El servicio no está disponible temporalmente. Intenta más tarde.';
      break;
    default:
      userMessage = message;
      break;
  }

  // Log para desarrollo
  console.warn('Mensaje para el usuario:', userMessage);
  toastService.showToast('error', 'Error', userMessage);
}
