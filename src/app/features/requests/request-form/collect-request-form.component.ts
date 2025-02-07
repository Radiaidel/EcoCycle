import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CollectRequest } from '../../../core/models/collect-request';
import { addCollectRequest, loadCollectRequests, updateCollectRequest, deleteCollectRequest } from '../../../core/state/collect-request/collect-request.actions';
import { selectCollectRequests } from '../../../core/state/collect-request/collect-request.selectors';
import { CollectRequestService } from '../../../core/services/collect-request.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collect-request',
  imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './collect-request-form.component.html',
standalone: true,
})
export class CollectRequestComponent implements OnInit {
  requests$: Observable<CollectRequest[]>;
  currentUserEmail: string;
  collectRequestForm: FormGroup;
  photos: string[] = []; 
  
  constructor(
    private store: Store,
    private collectRequestService: CollectRequestService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.requests$ = this.store.select(selectCollectRequests);
    this.currentUserEmail = this.authService.getCurrentUser()?.email || '';

    this.collectRequestForm = this.fb.group({
      wasteType: [[], [Validators.required]], 
      estimatedWeight: [null, [Validators.required, Validators.min(1000)]],
      address: ['', [Validators.required]],
      preferredDate: ['', [Validators.required]],
      preferredTime: ['', [Validators.required, Validators.pattern(/^(09|1[0-8]):[0-5][0-9]$/)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadCollectRequests({ userEmail: this.currentUserEmail }));
  }

  onSubmit(): void {
    if (this.collectRequestForm.valid) {
      const newRequest: CollectRequest = {
        id: this.generateId(),
        userEmail: this.currentUserEmail,
        wasteType: this.collectRequestForm.value.wasteType,
        estimatedWeight: this.collectRequestForm.value.estimatedWeight,
        address: this.collectRequestForm.value.address,
        preferredDate: new Date(this.collectRequestForm.value.preferredDate),
        preferredTime: this.collectRequestForm.value.preferredTime,
        notes: this.collectRequestForm.value.notes,
        photos: this.photos.length > 0 ? [...this.photos] : [], 
        status: 'pending'
      };
  
      this.store.dispatch(addCollectRequest({ request: newRequest }));
  
      this.collectRequestForm.reset();
      this.photos = [];
    }
  }
  

  updateRequest(request: CollectRequest): void {
    this.store.dispatch(updateCollectRequest({ request }));
  }

  deleteRequest(id: string): void {
    this.store.dispatch(deleteCollectRequest({ id }));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.photos.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  

  removePhoto(photo: string) {
    this.photos = this.photos.filter(p => p !== photo);
  }
  
}