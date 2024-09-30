import { Action, createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import AuthActions from './auth.action';

const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({ ...state, loading: true })),
  on(AuthActions.loginSuccess, (state, {type, ...user}) => ({
    ...state,
    user,
    loading: false,
  })),
  on(AuthActions.loginFailure, (state) => ({ ...state, loading: false })),

  on(AuthActions.refreshToken, (state) => ({ ...state, loading: true })),
  on(AuthActions.refreshTokenSuccess, (state, {type, ...token}) => ({
    ...state,
    user: { ...state.user, ...token },
    loading: false,
  })),
  on(AuthActions.refreshTokenFailure, (state) => ({ ...state, loading: false }))
);

export default authReducer;
