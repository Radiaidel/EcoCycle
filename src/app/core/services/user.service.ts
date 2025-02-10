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
  private static POINTS_KEY = 'user_points';

  constructor() {
    const storedUser = localStorage.getItem(UserService.CURRENT_USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
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


  updateUser(updatedUser: Partial<User>): Observable<boolean> {
    return of(updatedUser).pipe(
      tap(userUpdate => {
        const users = this.getUsers();
        const index = users.findIndex(u => u.email === userUpdate.email);
        
        if (index !== -1) {
          const existingUser = users[index];
          const updatedUserData = { ...existingUser, ...userUpdate };
          
          // Mettre à jour les users
          users[index] = updatedUserData;
          this.saveUsers(users);
          
          // Mettre à jour current user
          const currentUser = this.currentUserSubject.value;
          if (currentUser && currentUser.email === userUpdate.email) {
            localStorage.setItem(UserService.CURRENT_USER_KEY, JSON.stringify(updatedUserData));
            this.currentUserSubject.next(updatedUserData);
          }
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Error updating user:', error);
        return of(false);
      })
    );
  }

  
  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(UserService.USERS_KEY) || '[]');
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(UserService.USERS_KEY, JSON.stringify(users));
    console.log("Users updated in localStorage:", users);
  }
  private updateUserPoints(email: string, points: number): void {
    const storedPoints = localStorage.getItem(UserService.POINTS_KEY);
    let pointsData: { [key: string]: number } = storedPoints ? JSON.parse(storedPoints) : {};
    pointsData[email] = points;
    localStorage.setItem(UserService.POINTS_KEY, JSON.stringify(pointsData));
  }

  getUserPoints(email: string): number {
    const storedPoints = localStorage.getItem(UserService.POINTS_KEY);
    if (!storedPoints) return 0;
    
    const pointsData = JSON.parse(storedPoints);
    return pointsData[email] || 0;
  }
}
