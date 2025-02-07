import { Component, type OnInit, type OnDestroy } from "@angular/core"
import  { Store } from "@ngrx/store"
import  { Observable, Subscription } from "rxjs"
import { map } from "rxjs/operators"
import  { CollectRequest } from "../../../core/models/collect-request"
import * as CollectRequestActions from "../../../core/state/collect-request/collect-request.actions"
import * as CollectRequestSelectors from "../../../core/state/collect-request/collect-request.selectors"
import  { AuthService } from "../../../core/services/auth.service"
import { CommonModule } from "@angular/common"
import { SearchComponent } from "../../../shared/search-bar/search-bar.component"
import {  Router, RouterLink } from "@angular/router"
import  { CollectRequestService } from "../../../core/services/collect-request.service"

@Component({
  selector: "app-collect-request-list",
  templateUrl: "./request-list.component.html",
  imports: [CommonModule, SearchComponent, RouterLink],
  standalone: true,
})
export class RequestListComponent implements OnInit {
  
  filteredRequests$: Observable<CollectRequest[]>
  userRole$: string
  currentPhotoIndex: { [key: string]: number } = {}

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router,
  ) {
    this.filteredRequests$ = this.store.select(CollectRequestSelectors.selectFilteredCollectRequests)
    this.userRole$ = this.authService.getCurrentUser()?.role || "collecteur"
  }

  ngOnInit(): void {
    this.store.dispatch(CollectRequestActions.loadCollectRequests());
    this.initializePhotoIndices();
  }

  initializePhotoIndices(): void {
    this.filteredRequests$.subscribe(requests => {
      requests.forEach(request => {
        if (!this.currentPhotoIndex.hasOwnProperty(request.id)) {
          this.currentPhotoIndex[request.id] = 0;
        }
      });
    });
  }


  onSearch(keyword: string): void {
    this.store.dispatch(CollectRequestActions.setSearchKeyword({ keyword }))
  }

  onDeleteRequest(requestId: string): void {
    if (confirm("Are you sure you want to delete this request?")) {
      this.store.dispatch(CollectRequestActions.deleteCollectRequest({ id: requestId }))
    }
  }

  onEditRequest(request: CollectRequest) {
    this.router.navigate(["/requests/edit-collect-request", request.id])
  }

  prevPhoto(requestId: string) {
    if (this.currentPhotoIndex[requestId] > 0) {
      this.currentPhotoIndex[requestId]--
    }
  }

  nextPhoto(requestId: string) {
    this.filteredRequests$.pipe(map((requests) => requests.find((r) => r.id === requestId))).subscribe((request) => {
      if (request && request.photos && this.currentPhotoIndex[requestId] < request.photos.length - 1) {
        this.currentPhotoIndex[requestId]++
      }
    })
  }



  onStatusChange(requestId: string, event: Event) {
    this.store.dispatch(CollectRequestActions.updateRequestStatus({ requestId, status:(event.target as HTMLSelectElement).value }));
  }
  
}

