import { Component, type OnInit, inject, DestroyRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule, type AbstractControl } from "@angular/forms"
import { Router } from "@angular/router"
import { Store } from "@ngrx/store"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"
import type { User } from "../../../core/models/user"
import * as UserActions from "../../../core/state/user/user.actions"
import { selectUser } from "../../../core/state/user/user.selectors"
import { convertPoints } from "../../../core/state/points/point.actions"
import { selectVoucherByEmail } from "../../../core/state/points/point.selectors"

@Component({
  selector: "app-edit-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"],
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private store = inject(Store)
  private destroyRef = inject(DestroyRef)

  user: User | null = null
  profileForm!: FormGroup
  passwordForm!: FormGroup
  profileImage: string | ArrayBuffer | null = null
  today = new Date().toISOString().split("T")[0]
  voucher: string = '';



  ngOnInit() {
    this.store.dispatch(UserActions.loadUser());

    this.store.select(selectUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          this.user = user;
          if (!this.profileForm) {
            this.initForms();
          } else {
            this.profileForm.patchValue({
              fullName: user.fullName,
              phone: user.phone,
              address: user.address,
              city: user.city,
              birthDate: user.birthDate
            }, { emitEvent: false });
          }
          this.profileImage = user.profilePicture || null;
        }
      });

    this.store.select(state => state.points?.vouchers)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(vouchers => {
        if (vouchers && this.user?.email) {
          this.voucher = vouchers[this.user.email]?.toString() || '';
        }
      });

      this.store.select(selectVoucherByEmail(this.user?.email || ''))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(voucher => {
        this.voucher = voucher;
      });
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
      { validators: this.passwordMatchValidator },
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
          const updatedUser = { ...this.user, profilePicture: this.profileImage as string }
          this.store.dispatch(UserActions.updateUser({ user: updatedUser }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("newPassword")?.value === g.get("confirmPassword")?.value ? null : { mismatch: true }
  }

  updateProfile() {
    if (this.profileForm.valid && this.user) {
      const updatedUser: User = {
        ...this.user,
        ...this.profileForm.value,
        profilePicture: this.profileImage as string
      };
      
      this.store.dispatch(UserActions.updateUser({ user: updatedUser }));
    }
  }

  changePassword() {
    if (this.passwordForm.valid && this.user) {
      this.store.dispatch(
        UserActions.changePassword({
          email: this.user.email,
          oldPassword: this.passwordForm.value.oldPassword,
          newPassword: this.passwordForm.value.newPassword,
        }),
      )
      this.passwordForm.reset()
    }
  }

  deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.") && this.user) {
      this.store.dispatch(UserActions.deleteAccount({ email: this.user.email }))
    }
  }

  convertPoints() {
    if (!this.user?.email || !this.user?.points) return;

    let pointsToConvert = 0;
    if (this.user.points >= 500) pointsToConvert = 500;
    else if (this.user.points >= 200) pointsToConvert = 200;
    else if (this.user.points >= 100) pointsToConvert = 100;

    this.store.dispatch(convertPoints({
      userEmail: this.user.email,
      points: pointsToConvert
    }));

    this.showConversion = false;

  }

  getConversionButtonText(): string {
    if (!this.user?.points) return '';
    if (this.user.points >= 500) return 'Convert 500 pts';
    if (this.user.points >= 200) return 'Convert 200 pts';
    return 'Convert 100 pts';
  }

  showConversion = false;
  private hideTimeout: any;

  hideConversion() {
    this.hideTimeout = setTimeout(() => {
      this.showConversion = false;
    }, 300); // Délai pour éviter une fermeture immédiate
  }

  cancelHide() {
    clearTimeout(this.hideTimeout); // Annule la fermeture si la souris est encore dessus
  }

}