import { inject,PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiCallService } from '../services/api-call.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
export const authGuard: CanActivateFn = (route, state) => {
  
  debugger
  console.log('AuthGuard triggered');
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const apiCallService = inject(ApiCallService);
  if (isPlatformBrowser(platformId)) {
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
  }
  // If not in browser, allow access
  return of(true);
  
};