import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { CollectRequest } from '../../../core/models/collect-request';
import { addCollectRequest, loadCollectRequests, updateCollectRequest, deleteCollectRequest } from '../../../core/state/collect-request/collect-request.actions';
import { selectCollectRequests } from '../../../core/state/collect-request/collect-request.selectors';
import { CollectRequestService } from '../../../core/services/collect-request.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { SearchComponent } from '../../../shared/search-bar/search-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-collect-request',
  imports: [CommonModule, ReactiveFormsModule , SearchComponent , RouterLink],
    templateUrl: './request-list.component.html',
standalone: true,
})
export class RequestListComponent  {
  collectRequests: CollectRequest[] = [];
  filteredRequests: CollectRequest[] = [];
  private authService = inject(AuthService);
  private collectRequestService = inject(CollectRequestService)
  private subscription: Subscription = new Subscription();

  currentUser = this.authService.getCurrentUser();
  userRole =  this.currentUser?.role; 


  ngOnInit() {
    const collectRequestsSubscription = this.collectRequestService.getRequestsByUserEmail(this.currentUser?.email ?? '').subscribe((requests) => {
      this.collectRequests = requests;
      this.filteredRequests = requests;
    });

    this.subscription.add(collectRequestsSubscription);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onSearch(keyword: string) {
    this.filteredRequests = this.collectRequests.filter((request) =>
      request.wasteType.some((type) => type.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

}