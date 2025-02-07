import { Injectable } from '@angular/core';
import {  Observable, of } from 'rxjs';
import { CollectProcess } from '../models/collect-process.model';
import { CollectRequest } from '../models/collect-request';

export interface CollectData {
  materialType: string;
  weight: number;
  photos?: FileList;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollectProcessService {
    constructor() {}

    validateCollectRequest(requestId: string, processDetails: CollectProcess): Observable<CollectRequest> {
      try {
        const requests = this.getFromLocalStorage();
        const updatedRequests = requests.map(request => {
          if (request.id === requestId) {
            return {
              ...request,
              status: 'validated',
              processDetails: {
                ...processDetails,
                validationDate: new Date().toISOString()
              }
            };
          }
          return request;
        });
  
        this.saveToLocalStorage(updatedRequests);
        return of(updatedRequests.find(req => req.id === requestId)!);
      } catch (error) {
        throw error;
      }
    }
  
    updateRequestStatus(requestId: string, status: string): Observable<CollectRequest> {
      try {
        const requests = this.getFromLocalStorage();
        const updatedRequests = requests.map(request => {
          if (request.id === requestId) {
            return { ...request, status };
          }
          return request;
        });
  
        this.saveToLocalStorage(updatedRequests);
        return of(updatedRequests.find(req => req.id === requestId)!);
      } catch (error) {
        throw error;
      }
    }
  
    private getFromLocalStorage(): CollectRequest[] {
      const data = localStorage.getItem('collectRequests');
      return data ? JSON.parse(data) : [];
    }
  
    private saveToLocalStorage(requests: CollectRequest[]): void {
      localStorage.setItem('collectRequests', JSON.stringify(requests));
    }
  }