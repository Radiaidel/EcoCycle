import { Inject, Injectable } from "@angular/core"
import {  Observable, of, throwError, Subject, mergeMap } from "rxjs"
import  { CollectRequest } from "../models/collect-request"
import { NotificationService } from "./notification.service"

@Injectable({
  providedIn: "root",
})
export class CollectRequestService {
  private static REQUESTS_KEY = "collectRequests";

  constructor(private notificationService: NotificationService) {}

  private validateRequestConstraints(request: CollectRequest, requests: CollectRequest[]): Observable<boolean> {
    const userRequests = requests.filter(
      (req) => req.userEmail === request.userEmail && req.status === "pending"
    );

    if (userRequests.length >= 3) {
      this.notificationService.showMessage("You cannot have more than 3 pending requests simultaneously.", "error");
      return of(false);
    }

    const totalWeight = userRequests.reduce((sum, req) => sum + req.estimatedWeight, 0) + request.estimatedWeight;
    if (totalWeight > 10000) {
      this.notificationService.showMessage("Total weight of you pending requests cannot exceed 10kg.", "error");
      return of(false);
    }

    return of(true);
  }

  getRequestsByUserEmail(userEmail: string): Observable<CollectRequest[]> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    if (!storedRequests) {
      return of([]);
    }

    try {
      const requests: CollectRequest[] = JSON.parse(storedRequests);
      return of(requests.filter((request) => request.userEmail === userEmail));
    } catch (error) {
      this.notificationService.showMessage("Error retrieving collect requests. Please try again.", "error");
      return of([]);
    }
  }

  addRequest(request: CollectRequest): Observable<CollectRequest> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    const requests: CollectRequest[] = storedRequests ? JSON.parse(storedRequests) : [];

    return this.validateRequestConstraints(request, requests).pipe(
      mergeMap((isValid) => {
        if (!isValid) {
          return of();
        }

        requests.push(request);
        localStorage.setItem(CollectRequestService.REQUESTS_KEY, JSON.stringify(requests));
        this.notificationService.showMessage("Request successfully added!", "success");
        return of(request);
      })
    );
  }

  updateRequest(updatedRequest: CollectRequest): Observable<CollectRequest> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    const requests: CollectRequest[] = storedRequests ? JSON.parse(storedRequests) : [];

    const index = requests.findIndex((req) => req.id === updatedRequest.id);
    if (index === -1) {
      this.notificationService.showMessage("Request not found.", "error");
      return of();
    }

    if (requests[index].status !== "pending") {
      this.notificationService.showMessage("Only pending requests can be modified.", "error");
      return of();
    }

    return this.validateRequestConstraints(updatedRequest, requests).pipe(
      mergeMap((isValid) => {
        if (!isValid) {
          return of();
        }

        requests[index] = updatedRequest;
        localStorage.setItem(CollectRequestService.REQUESTS_KEY, JSON.stringify(requests));
        this.notificationService.showMessage("Request successfully updated!", "success");
        return of(updatedRequest);
      })
    );
  }

  deleteRequest(id: string): Observable<string> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    let requests: CollectRequest[] = storedRequests ? JSON.parse(storedRequests) : [];

    const index = requests.findIndex((req) => req.id === id);
    if (index === -1) {
      this.notificationService.showMessage("Request not found.", "error");
      return of();
    }

    if (requests[index].status !== "pending") {
      this.notificationService.showMessage("Only pending requests can be deleted.", "error");
      return of();
    }

    requests = requests.filter((req) => req.id !== id);
    localStorage.setItem(CollectRequestService.REQUESTS_KEY, JSON.stringify(requests));
    this.notificationService.showMessage("Request successfully deleted!", "success");
    return of(id);
  }

  getAllRequests(): Observable<CollectRequest[]> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    return of(storedRequests ? JSON.parse(storedRequests) : []);
  }

  getRequestById(id: string): CollectRequest | undefined {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    if (!storedRequests) {
      return undefined;
    }
    const requests: CollectRequest[] = JSON.parse(storedRequests);
    return requests.find((request) => request.id === id);
  }

  updateStatus(requestId: string, status: string): Observable<CollectRequest> {
    const storedRequests = localStorage.getItem(CollectRequestService.REQUESTS_KEY);
    const requests: CollectRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
  
    const request = requests.find((req) => req.id === requestId);
    if (!request) {
      this.notificationService.showMessage("Request not found.", "error");
      return of();
    }
  
    request.status = status;
    localStorage.setItem(CollectRequestService.REQUESTS_KEY, JSON.stringify(requests));
  
    this.notificationService.showMessage("Request status successfully updated!", "success");
    return of(request);
  }
  
  
}