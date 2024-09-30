import { LoginResponse } from "../models/login.model";
export interface AuthState {
  loading: boolean,
  user: LoginResponse
}
export const initialAuthState: AuthState = {
  loading: false,
  user: {
    id: 0,
    name: "",
    refreshToken: "",
    token: ""
  }
}