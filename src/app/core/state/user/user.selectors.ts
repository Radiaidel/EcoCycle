import { createFeatureSelector, createSelector } from "@ngrx/store"
import type { UserState } from "./user.reducer"

export const selectUserState = createFeatureSelector<UserState>("user")

export const selectUser = createSelector(selectUserState, (state: UserState) => state.user)

export const selectUserLoading = createSelector(selectUserState, (state: UserState) => state.loading)

export const selectUserError = createSelector(selectUserState, (state: UserState) => state.error)

