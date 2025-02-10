// import { Injectable } from '@angular/core';
// import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { UserService } from '../services/user.service';
// import { User } from '../models/user';
// import { Observable, of } from 'rxjs';
// import { take, mergeMap, catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProfileResolver implements Resolve<User | null> {
//   constructor(private userService: UserService, private router: Router) {}

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {
//     return this.userService.getCurrentUser().pipe(
//       take(1),
//       mergeMap(user => {
//         if (user) {
//           return of(user);
//         } else {
//           this.router.navigate(['/login']);
//           return of(null);
//         }
//       }),
//       catchError(error => {
//         console.error('Error in ProfileResolver:', error);
//         this.router.navigate(['/login']);
//         return of(null);
//       })
//     );
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<any> {
  constructor(private authService: AuthService) {}

  resolve(): Observable<any> {
    const user = this.authService.getCurrentUser();
    return user ? of(user) : of(null); // Convertit en Observable
  }
}


// }
