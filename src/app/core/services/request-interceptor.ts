import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Storage } from '../storage';
import { AuthService } from '../../services/auth/auth-service';
import { catchError, of } from 'rxjs';

export function requestInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const storage = inject(Storage);
  const authToken = storage.getItem('access_token');
  // const authService = inject(AuthService);

  const newReq = req.clone({
    headers: authToken ? req.headers.append('Authorization', `Bearer ${authToken}`) : req.headers,
  });

  return next(newReq).pipe(
    catchError((err) => {
      const httpError = err as HttpErrorResponse;

      console.error('HTTP error', httpError);

      if (httpError.status === 401) {
        // TODO: handle 401
        storage.removeItem('access_token');
      }

      return of(err);
    })
  );
}
