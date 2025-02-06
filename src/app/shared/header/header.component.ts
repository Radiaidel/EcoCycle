import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import type { Subscription } from "rxjs"
import { AuthService } from "../../core/services/auth.service"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false
  isDropdownOpen = false
  isMobileMenuOpen = false
  userProfileImage = ""
  private authSubscription: Subscription | null = null

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.updateAuthState()
    this.authSubscription = this.authService.authState$.subscribe(() => {
      this.updateAuthState()
    })
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe()
    }
  }

  private updateAuthState() {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.userProfileImage = this.authService.getUserProfileImage()
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  logout() {
    this.authService.logout()
    this.router.navigate(["/login"])
  }

  navigateTo(path: string) {
    this.router.navigate([path])
    this.isMobileMenuOpen = false
    this.isDropdownOpen = false
  }
}

