import { Injectable } from '@angular/core';
import { CollectRequest } from '../models/collect-request';
import { Observable, of } from 'rxjs'; // Assurez-vous d'importer `of`

@Injectable({
  providedIn: 'root',
})
export class CollectRequestService {
  private static REQUESTS_KEY = 'collectRequests';

  constructor() {}

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
      console.error('Error parsing collect requests from localStorage', error);
      return of([]);
    }
  }

  addRequest(request: CollectRequest): Observable<void> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    let requests: CollectRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
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
