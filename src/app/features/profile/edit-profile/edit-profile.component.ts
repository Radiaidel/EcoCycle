import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule, type AbstractControl } from "@angular/forms"
import { UserService } from "../../../core/services/user.service"
import { Router } from "@angular/router"
import type { User } from "../../../core/models/user"
import { ActivatedRoute } from "@angular/router"
import { NotificationService } from "../../../core/services/notification.service"
import { AuthService } from "../../../core/services/auth.service"
import { Subscription } from "rxjs"

@Component({
  selector: "app-edit-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
  private userService = inject(UserService)
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private notificationService = inject(NotificationService)

  user: User | null = null
  profileForm!: FormGroup
  passwordForm!: FormGroup
  successMessage = ""
  errorMessage = ""
  profileImage: string | ArrayBuffer | null = null
  today?: string ;
  private routeSubscription: Subscription | null = null
  private userServiceSubscription: Subscription | null = null

  ngOnInit() {
    this.today = new Date().toISOString().split('T')[0];

    this.routeSubscription =  this.route.data.subscribe((data) => {
      this.user = data["user"]
      if (this.user) {
        console.log(this.user.birthDate)
        this.initForms()
        this.profileImage = this.user.profilePicture || null
        
      }
    })
  }
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe()
    }
  }
  initForms() {
    this.profileForm = this.fb.group({
      fullName: [this.user?.fullName, [Validators.required, Validators.minLength(3)]],
      phone: [this.user?.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: [this.user?.address, [Validators.required]],
      city: [this.user?.city, [Validators.required]],
      birthDate: [this.user?.birthDate, [Validators.required, this.ageValidator]],
    })

    this.passwordForm = this.fb.group(
      {
        oldPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validator: this.passwordMatchValidator },
    )
  }

  ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value) {
      const birthDate = new Date(control.value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age < 18 || birthDate > today) {
        return { invalidAge: true }
      }
    }
    return null
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.profileImage = reader.result
        if (this.user) {
          this.user.profilePicture = this.profileImage as string
          this.updateProfile(true)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("newPassword")?.value === g.get("confirmPassword")?.value ? null : { mismatch: true }
  }

  updateProfile(isProfilePicture = false) {
    if ((this.profileForm.valid || isProfilePicture) && this.user) {
      const updatedUser: User = { ...this.user, ...this.profileForm.value, profilePicture: this.profileImage as string }
      this.userServiceSubscription = this.userService.updateUser(updatedUser).subscribe(
        (success) => {
          if (success) {
            this.notificationService.showMessage("Profile updated successfully!", "success")
            this.user = updatedUser
            this.authService.updateUserProfileImage(this.profileImage as string)
          } else {
            this.notificationService.showMessage("Failed to update profile.", "error")
          }
        },
        (error) => this.notificationService.showMessage("An error occurred while updating the profile.", "error"),
      )
    } else if (!isProfilePicture) {
      this.notificationService.showMessage("Please fill in all required fields correctly.", "error")
    }
  }

  changePassword() {
    if (this.passwordForm.valid && this.user) {
      this.userServiceSubscription =  this.userService
        .changePassword(this.user.email, this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword)
        .subscribe(
          (success) => {
            if (success) {
              this.notificationService.showMessage("Password changed successfully!", "success")
              this.passwordForm.reset()
            } else {
              this.notificationService.showMessage("Incorrect old password.", "error")
            }
          },
          (error) => this.notificationService.showMessage("An error occurred while changing the password.", "error"),
        )
    }
  }

  convertPoints(points: number) {
    if (this.user) {
      this.userServiceSubscription =  this.userService.convertPointsToVoucher(this.user.id, points).subscribe(
        (voucher) => {
          if (voucher !== null) {
            this.notificationService.showMessage(`Converted ${points} points to a ${voucher} Dh voucher!`, "success")
            if (this.user) {
              this.user.points -= points
            }
          } else {
            this.notificationService.showMessage("Not enough points.", "error")
          }
        },
        (error) => this.notificationService.showMessage("An error occurred while converting points.", "error"),
      )
    }
  }

  deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.") && this.user) {
      this.userServiceSubscription = this.userService.deleteAccount(this.user.email).subscribe(
        (success) => {
          if (success) {
            this.router.navigate(["/login"])
          } else {
            this.notificationService.showMessage("Failed to delete account.", "error")
          }
        },
        (error) => this.notificationService.showMessage("An error occurred while deleting the account.", "error"),
      )
    }
  }
}

