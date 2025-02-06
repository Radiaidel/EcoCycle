import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const currentUser = userService.getCurrentUser();

  // Si l'utilisateur est déjà authentifié, redirige vers le profil
  if (currentUser) {
    router.navigate(['/profile']);
    return false;  // Empêche l'accès à la page de login ou d'enregistrement
  }

  // Si l'utilisateur n'est pas authentifié, laisse passer la requête
  return true;
};
