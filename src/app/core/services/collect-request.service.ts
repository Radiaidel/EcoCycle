import { inject, Injectable } from '@angular/core';
import { CollectRequest } from '../models/collect-request';
import { Observable, of } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class CollectRequestService {
  private static REQUESTS_KEY = 'collectRequests';
  private notificationsService = inject(NotificationService);
  constructor() { }

  getRequestsByUserEmail(userEmail: string): Observable<CollectRequest[]> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    if (!storedRequests) {
      return of([]);
    }

    try {
      const requests: CollectRequest[] = JSON.parse(storedRequests);
      const filteredRequests = requests.filter(request => request.userEmail === userEmail);
      return of(filteredRequests);
    } catch (error) {
      this.notificationsService.showMessage('Erreur lors de la récupération des demandes de collecte', 'error');
      return of([]);
    }
  }

  addRequest(request: CollectRequest): Observable<void> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    let requests: CollectRequest[] = storedRequests ? JSON.parse(storedRequests) : [];

    const totalWeight = requests.reduce((sum, req) => sum + req.estimatedWeight, 0) + request.estimatedWeight;
    if (totalWeight > 10000) {
      this.notificationsService.showMessage('Le poids total des collectes ne doit pas dépasser 10kg.', 'error');
    }

    const pendingRequests = requests.filter(req => req.status === 'pending' && req.userEmail === request.userEmail);
    if (pendingRequests.length >= 3) {
      this.notificationsService.showMessage('Vous ne pouvez pas avoir plus de 3 demandes non validées.', 'error');
    }

    requests.push(request);
    localStorage.setItem(CollectRequestService.REQUESTS_KEY, JSON.stringify(requests));
    return of();
  }

  updateRequest(updatedRequest: CollectRequest): Observable<void> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    let requests: CollectRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
    requests = requests.map(req => req.id === updatedRequest.id ? updatedRequest : req);
    localStorage.setItem(CollectRequestService.REQUESTS_KEY, JSON.stringify(requests));
    return of();
  }

  deleteRequest(id: string): Observable<void> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    let requests: CollectRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
    requests = requests.filter(req => req.id !== id);
    localStorage.setItem(CollectRequestService.REQUESTS_KEY, JSON.stringify(requests));
    return of();
  }

  private getRequests(): CollectRequest[] {
    return JSON.parse(localStorage.getItem(CollectRequestService.REQUESTS_KEY) || '[]');
  }


  getRequestById(id: string): CollectRequest | undefined {
    return this.getRequests().find(request => request.id === id);
  }

  getAllRequests(): Observable<CollectRequest[]> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    return of(storedRequests ? JSON.parse(storedRequests) : []);
  }
}
