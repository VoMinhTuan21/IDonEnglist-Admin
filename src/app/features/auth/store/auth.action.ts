import { createAction, props } from "@ngrx/store";
import { LoginForm, LoginRequest, LoginResponse } from "../models/login.model";
import { Token } from "../../../shared/models/common";

export const login = createAction("[Auth] Login", props<LoginForm>());
export const loginSuccess = createAction("[Auth] Login Success", props<LoginResponse>());
export const loginFailure = createAction("[Auth] Login Failure", props<{error: string}>());

export const refreshToken = createAction("[Auth] Refresh Token", props<Token>());
export const refreshTokenSuccess = createAction("[Auth] Refresh Token Success", props<Token>());
export const refreshTokenFailure = createAction("[Auth] Refresh Token Failure", props<{error: string}>());

const logout = createAction("[Auth] Logout");

const AuthActions = {
  login,
  loginSuccess,
  loginFailure,

  refreshToken,
  refreshTokenSuccess,
  refreshTokenFailure,

  logout
};

export default AuthActions;