import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private static USERS_KEY = 'users';
  private static CURRENT_USER_KEY = 'currentUser';
  private currentUserSubject: BehaviorSubject<User | null>;

  constructor() {
    const storedUser = localStorage.getItem(UserService.CURRENT_USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  updateUser(updatedUser: User): Observable<boolean> {
    return of(updatedUser).pipe(
      tap(user => {
        const users = this.getUsers();
        const index = users.findIndex(u => u.email === user.email);
        if (index !== -1) {
          users[index] = user;
          this.saveUsers(users);
          localStorage.setItem(UserService.CURRENT_USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<boolean> {
    return of(this.getUsers()).pipe(
      map(users => {
        const user = users.find(u => u.email === email);
        if (user && user.password === oldPassword) {
          user.password = newPassword;
          this.saveUsers(users);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  deleteAccount(email: string): Observable<boolean> {
    return of(this.getUsers()).pipe(
      map(users => {
        const updatedUsers = users.filter(u => u.email !== email);
        this.saveUsers(updatedUsers);
        localStorage.removeItem(UserService.CURRENT_USER_KEY);
        this.currentUserSubject.next(null);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(UserService.USERS_KEY) || '[]');
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users));
  }

  convertPointsToVoucher(userId: number, pointsToConvert: number): Observable<number | null> {
    const conversionTable: { [key: number]: number } = { 100: 50, 200: 120, 500: 350 };
    return this.getCurrentUser().pipe(
      map(user => {
        if (user && user.points >= pointsToConvert && conversionTable[pointsToConvert]) {
          user.points -= pointsToConvert;
          this.updateUser(user);
          return conversionTable[pointsToConvert];
        }
        return null;
      })
    );
  }
}
