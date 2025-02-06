import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const currentUser = userService.getCurrentUser();

  // Si l'utilisateur n'est pas authentifié, redirige vers la page de login
  if (!currentUser) {
    router.navigate(['/login']);
    return false;  // Empêche l'accès à la page si l'utilisateur n'est pas authentifié
  }

  // Si l'utilisateur est authentifié, laisse passer la requête
  return true;
};
