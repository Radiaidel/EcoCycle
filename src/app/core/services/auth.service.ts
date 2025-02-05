// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static USERS_KEY = 'users';

  constructor() {}

  getUsers(): User[] {
    const users = localStorage.getItem(AuthService.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  isEmailTaken(email: string): boolean {
    return this.getUsers().some((user) => user.email === email);
  }

  registerUser(user: User): boolean {
    if (this.isEmailTaken(user.email)) {
      return false; 
    }
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(AuthService.USERS_KEY, JSON.stringify(users));
    return true; 
  }
}
