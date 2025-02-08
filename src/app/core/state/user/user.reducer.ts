import { createReducer, on } from "@ngrx/store"
import type { User } from "../../models/user"
import * as UserActions from "./user.actions"

export interface UserState {
  user: User | null
  loading: boolean
  error: any
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
}

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUser, (state) => ({ ...state, loading: true })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(UserActions.loadUserFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(UserActions.updateUser, (state) => ({ ...state, loading: true })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(UserActions.updateUserFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(UserActions.changePassword, (state) => ({ ...state, loading: true })),
  on(UserActions.changePasswordSuccess, (state) => ({ ...state, loading: false })),
  on(UserActions.changePasswordFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(UserActions.deleteAccount, (state) => ({ ...state, loading: true })),
  on(UserActions.deleteAccountSuccess, (state) => ({ ...state, user: null, loading: false })),
  on(UserActions.deleteAccountFailure, (state, { error }) => ({ ...state, error, loading: false })),
)

