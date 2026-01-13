import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado.';

      // Client-side or network error
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error de red: ${error.error.message}`;
      } else {
        // Backend returned an unsuccessful response code
        switch (error.status) {
          case 400:
            // Try to extract message within structured JSON if available
            if (
              error.error &&
              typeof error.error === 'object' &&
              error.error.message
            ) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Solicitud incorrecta.';
            }
            break;
          case 401:
            errorMessage =
              'Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tienes permisos para realizar esta acción.';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
            break;
          case 0:
            errorMessage =
              'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
            break;
          default:
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = `Error ${error.status}: ${error.statusText}`;
            }
        }
      }

      notificationService.error(errorMessage);
      console.error('HTTP Error:', error);

      return throwError(() => error);
    })
  );
};
