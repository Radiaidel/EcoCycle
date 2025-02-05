import { CanActivateFn } from '@angular/router';

export const collecteurGuard: CanActivateFn = (route, state) => {
  return true;
};
