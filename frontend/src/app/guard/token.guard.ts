import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const tokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = localStorage.getItem('token');
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
