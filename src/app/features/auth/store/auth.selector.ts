import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
)