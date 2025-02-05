import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitialisationService {

  constructor() {}

  initUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.length === 0) {
      const collecteurs = [
        { fullName: 'Collecteur 1', email: 'collecteur1@example.com', password: 'password123', role: 'collecteur' },
        { fullName: 'Collecteur 2', email: 'collecteur2@example.com', password: 'password123', role: 'collecteur' },
        { fullName: 'Collecteur 3', email: 'collecteur3@example.com', password: 'password123', role: 'collecteur' },
        { fullName: 'Collecteur 4', email: 'collecteur4@example.com', password: 'password123', role: 'collecteur' }
      ];

      localStorage.setItem('users', JSON.stringify(collecteurs));
    }
  }
}
