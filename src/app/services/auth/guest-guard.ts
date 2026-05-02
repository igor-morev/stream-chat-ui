import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  const guestUrls = ['/login', '/register']; // Define the routes that should be accessible to guests

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.isAuthenticated() && guestUrls.includes(state.url)) {
    return router.createUrlTree(['/stream', 'chat']); // Redirect authenticated users to the home page
  } else {
    return true;
  }
  
};
