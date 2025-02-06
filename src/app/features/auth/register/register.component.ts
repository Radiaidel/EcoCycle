import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationComponent } from '../../../shared/notification/notification.component';
import { CommonModule, NgIf } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule , NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;


  constructor(private fb: FormBuilder, private authService: AuthService , private notificationService: NotificationService , private route: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['particulier'],
      points: [0]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.notificationService.showMessage("Please fill in all required fields." , 'error');
      return;
    }

    const isRegistered = this.authService.registerUser(this.registerForm.value);

    if (isRegistered) {
      this.notificationService.showMessage("Registration successful! 🎉" , 'success');
      this.registerForm.reset();
      this.route.navigate(['/login']);
    } else {
      this.notificationService.showMessage("Email is already taken!" , 'error');
    }
  }
}
