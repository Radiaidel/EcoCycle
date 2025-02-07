import { Component,  OnInit,  OnDestroy, inject } from "@angular/core"
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { Subscription } from "rxjs"
import  { CollectRequestService } from "../../../core/services/collect-request.service"
import  { AuthService } from "../../../core/services/auth.service"
import { CommonModule } from "@angular/common"
import  { Router, ActivatedRoute } from "@angular/router"
import  { CollectRequest } from "../../../core/models/collect-request"
import { Store } from "@ngrx/store"
import { CollectRequestState } from "../../../core/state/collect-request/collect-request.reducer"
import { addCollectRequest, loadCollectRequests, updateCollectRequest } from "../../../core/state/collect-request/collect-request.actions"
import { selectCollectRequestById } from "../../../core/state/collect-request/collect-request.selectors"

@Component({
  selector: "app-collect-request",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./collect-request-form.component.html",
  standalone: true,
})
export class CollectRequestComponent implements OnInit, OnDestroy {
  currentUserEmail: string
  collectRequestForm: FormGroup
  photos: string[] = []
  private subscriptions: Subscription[] = []
  collectRequest: CollectRequest | null = null
  isEditMode = false


  private store = inject(Store<CollectRequestState>);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
private authService = inject(AuthService);

  constructor(
  ) {
    this.currentUserEmail = this.authService.getCurrentUser()?.email || ""
    this.collectRequestForm = this.fb.group({
      wasteType: [[], [Validators.required]],
      estimatedWeight: [null, [Validators.required, Validators.min(1000)]],
      address: ["", [Validators.required]],
      preferredDate: ["", [Validators.required, this.dateValidator]],
      preferredTime: ["", [Validators.required, Validators.pattern(/^(09|1[0-8]):[0-5][0-9]$/)]],
      notes: [""],
    })
  }

  ngOnInit(): void {
    this.store.dispatch(loadCollectRequests());
    this.route.paramMap.subscribe((params) => {
      const requestId = params.get("id");
      if (requestId) {
        this.isEditMode = true;
        this.store.select(selectCollectRequestById(requestId)).subscribe((request) => {
          if (request) {
            this.collectRequest = request;
            this.collectRequestForm.patchValue({
              wasteType: request.wasteType,
              estimatedWeight: request.estimatedWeight,
              address: request.address,
              preferredDate: request.preferredDate,
              preferredTime: request.preferredTime,
              notes: request.notes,
            });
            this.photos = request.photos || [];
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSubmit(): void {
    if (this.collectRequestForm.valid) {
      const requestData: CollectRequest = {
        id: this.collectRequest?.id || this.generateId(),
        userEmail: this.currentUserEmail,
        ...this.collectRequestForm.value,
        status: "pending",
        photos: this.photos,
      };

      if (this.isEditMode) {
        this.store.dispatch(updateCollectRequest({ request: requestData }));
      } else {
        this.store.dispatch(addCollectRequest({ request: requestData }));
      }

      this.router.navigate(["/requests"]);
    } else {
      this.markFormGroupTouched(this.collectRequestForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
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
    this.photos = this.photos.filter((p) => p !== photo);
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  dateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date();
    const inputDate = new Date(control.value);
    return inputDate > today ? null : { dateInvalid: true };
  }
}
