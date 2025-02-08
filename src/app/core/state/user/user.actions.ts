import { createAction, props } from "@ngrx/store"
import type { User } from "../../models/user"

export const loadUser = createAction("[User] Load User")
export const loadUserSuccess = createAction("[User] Load User Success", props<{ user: User }>())
export const loadUserFailure = createAction("[User] Load User Failure", props<{ error: any }>())

export const updateUser = createAction("[User] Update User", props<{ user: User }>())
export const updateUserSuccess = createAction("[User] Update User Success", props<{ user: User }>())
export const updateUserFailure = createAction("[User] Update User Failure", props<{ error: any }>())

export const changePassword = createAction(
  "[User] Change Password",
  props<{ email: string; oldPassword: string; newPassword: string }>(),
)
export const changePasswordSuccess = createAction("[User] Change Password Success")
export const changePasswordFailure = createAction("[User] Change Password Failure", props<{ error: any }>())

export const deleteAccount = createAction("[User] Delete Account", props<{ email: string }>())
export const deleteAccountSuccess = createAction("[User] Delete Account Success")
export const deleteAccountFailure = createAction("[User] Delete Account Failure", props<{ error: any }>())

