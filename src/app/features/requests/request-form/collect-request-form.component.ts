import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CollectRequestService } from '../../../core/services/collect-request.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collect-request',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collect-request-form.component.html',
  standalone: true,
})
export class CollectRequestComponent implements OnInit {
  // requests$: Observable<CollectRequest[]>;
  currentUserEmail: string;
  collectRequestForm: FormGroup;
  photos: string[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private collectRequestService: CollectRequestService,
    private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationService
  ) {
    this.currentUserEmail = this.authService.getCurrentUser()?.email || '';
    this.collectRequestForm = this.fb.group({
      wasteType: [[], [Validators.required]],
      estimatedWeight: [null, [Validators.required, Validators.min(1000)]],
      address: ['', [Validators.required]],
      preferredDate: ['', [Validators.required, this.dateValidator]],
      preferredTime: ['', [Validators.required, Validators.pattern(/^(09|1[0-8]):[0-5][0-9]$/), this.timeValidator]],
      notes: ['']
    });
  }

  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }






  onSubmit(): void {
    if (this.collectRequestForm.valid) {
      const newRequest = {
        id: this.generateId(),
        userEmail: this.currentUserEmail,
        ...this.collectRequestForm.value,
        status: 'pending',
      };

      const requestSubscription = this.collectRequestService.addRequest(newRequest).subscribe({
        next: () => {
          this.notificationsService.showMessage('Request submitted successfully', 'success');
          this.router.navigate(['/requests']);
        },
        error: (error) => {
          this.notificationsService.showMessage(error.message, 'error');
        },
      });

      this.subscriptions.push(requestSubscription);
    }
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

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  dateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date();
    const inputDate = new Date(control.value);
    return inputDate > today ? null : { dateInvalid: true };
  }

  timeValidator(control: any): { [key: string]: boolean } | null {
    const time = control.value.split(':');
    const hour = parseInt(time[0], 10);
    return hour < 18 ? null : { timeInvalid: true };
  }

}