import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CollectRequestService } from '../services/collect-request.service';

@Injectable({
  providedIn: 'root'
})
export class RequestsResolver implements Resolve<any> {
  constructor(private requestService: CollectRequestService) {}

  resolve(): Observable<any> {
    return this.requestService.getAllRequests(); // Récupère toutes les demandes
  }
}
