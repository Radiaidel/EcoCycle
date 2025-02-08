import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { NotificationService } from "../../services/notification.service";
import * as UserActions from "./user.actions";
import { Router } from "@angular/router";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  // Fixed loadUserOnLogin$ effect
  loadUserOnLogin$ = createEffect(() =>
    this.authService.userLoggedIn$.pipe(
      switchMap((isLoggedIn) => 
        isLoggedIn ? of(UserActions.loadUser()) : of()
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(() =>
        this.userService.getCurrentUser().pipe(
          map((user) => {
            if (user) {
              return UserActions.loadUserSuccess({ user });
            } else {
              return UserActions.loadUserFailure({ error: 'User not found' });
            }
          }),
          catchError((error) => of(UserActions.loadUserFailure({ error }))),
        ),
      ),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ user }) =>
        this.userService.updateUser(user).pipe(
          map(() => {
            this.notificationService.showMessage("Profile updated successfully!", "success");
            this.authService.updateUserProfileImage(user.profilePicture || "");
            return UserActions.updateUserSuccess({ user });
          }),
          catchError((error) => {
            this.notificationService.showMessage("Failed to update profile.", "error");
            return of(UserActions.updateUserFailure({ error }));
          }),
        ),
      ),
    ),
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.changePassword),
      mergeMap(({ email, oldPassword, newPassword }) =>
        this.userService.changePassword(email, oldPassword, newPassword).pipe(
          map(() => {
            this.notificationService.showMessage("Password changed successfully!", "success");
            return UserActions.changePasswordSuccess();
          }),
          catchError((error) => {
            this.notificationService.showMessage("Failed to change password.", "error");
            return of(UserActions.changePasswordFailure({ error }));
          }),
        ),
      ),
    ),
  );

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteAccount),
      mergeMap(({ email }) =>
        this.userService.deleteAccount(email).pipe(
          map(() => {
            this.router.navigate(["/login"]);
            return UserActions.deleteAccountSuccess();
          }),
          catchError((error) => {
            this.notificationService.showMessage("Failed to delete account.", "error");
            return of(UserActions.deleteAccountFailure({ error }));
          }),
        ),
      ),
    ),
  );
}