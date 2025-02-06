import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  message$ = this.messageSubject.asObservable();

  showMessage(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.messageSubject.next({ message, type });
    setTimeout(() => {
      this.messageSubject.next(null);
    }, 3000);
  }
}
