import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { CookieService } from '../../../core/services/cookie.service';
import { AuthService } from '../auth.service';
import AuthActions from './auth.action';
import { REMEMBER_ME } from '../../../shared/models/constants';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ type, remember, ...action }) =>
        this.authService.login(action).pipe(
          map((response) => {
            this.cookieService.setToken(
              { token: response.token, refreshToken: response.refreshToken },
              remember ? 7 : 1
            );
            this.cookieService.setCookie(REMEMBER_ME, remember ? '1' : '0', 7);
            return AuthActions.loginSuccess(response);
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      mergeMap(({ type, ...token }) =>
        this.authService.refreshToken(token).pipe(
          map((response) => {
            const remember = this.cookieService.getCookie(REMEMBER_ME);
            this.cookieService.setToken(
              { token: response.token, refreshToken: response.refreshToken },
              !!remember ? 7 : 1
            );
            return AuthActions.refreshTokenSuccess(response);
          }),
          catchError((error) =>
            of(AuthActions.refreshTokenFailure({ error: error.message }))
          )
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.cookieService.deleteToken();
        })
      ),
    { dispatch: false }
  );
}
