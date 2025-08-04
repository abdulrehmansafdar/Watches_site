import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiCallService } from '../services/api-call.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  debugger
  console.log('AuthGuard triggered');
  const router = inject(Router);
  const apiCallService = inject(ApiCallService);

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return of(false);
  }

  // Verify token with API
   return apiCallService.PostcallWithToken(`User/VerifyToken`, {token :token}).pipe(
    map((response) => {
      if (response === true) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};