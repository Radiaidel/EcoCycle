import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static USERS_KEY = 'users';
  private static CURRENT_USER_KEY = 'currentUser';
  private authStateSubject = new BehaviorSubject<{ isLoggedIn: boolean; userProfileImage: string }>({
    isLoggedIn: false,
    userProfileImage: "",
  });

  authState$ = this.authStateSubject.asObservable();

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }


  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(AuthService.USERS_KEY) || '[]');
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(AuthService.USERS_KEY, JSON.stringify(users));
  }

  isEmailTaken(email: string): boolean {
    return this.getUsers().some(user => user.email === email);
  }

  registerUser(user: User): boolean {
    if (this.isEmailTaken(user.email)) return false;
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
    return true;
  }

  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  userLoggedIn$: Observable<boolean> = this.userLoggedInSubject.asObservable();

  login(email: string, password: string): boolean {
    const user = this.getUsers().find(user => user.email === email && user.password === password);
    if (user) {
      localStorage.setItem(AuthService.CURRENT_USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.authStateSubject.next({ isLoggedIn: true, userProfileImage: user.profilePicture || '' });
      this.userLoggedInSubject.next(true); 
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(AuthService.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
    this.authStateSubject.next({ isLoggedIn: false, userProfileImage: '' });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(AuthService.CURRENT_USER_KEY);
  }

  updateUserProfileImage(newImageUrl: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.profilePicture = newImageUrl;
      this.updateUser(currentUser);
    }
  }

  updateUser(updatedUser: User): void {
    let users = this.getUsers();
    users = users.map(user => user.email === updatedUser.email ? updatedUser : user);
    this.saveUsers(users);
    localStorage.setItem(AuthService.CURRENT_USER_KEY, JSON.stringify(updatedUser));
    this.authStateSubject.next({ isLoggedIn: true, userProfileImage: updatedUser.profilePicture || '' });
  }

  getUserProfileImage(): string  {
    const user = this.getCurrentUser();
    return user?.profilePicture || "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"; 
  }
}