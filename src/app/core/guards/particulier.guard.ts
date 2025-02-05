import { CanActivateFn } from '@angular/router';

export const particulierGuard: CanActivateFn = (route, state) => {
  return true;
};
