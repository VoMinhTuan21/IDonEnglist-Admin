import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExcludeErrorAPI, REMEMBER_ME } from '@shared/models/constants';
import { CookieService } from '@core/services/cookie.service';
import { AuthService } from '@features/auth/auth.service';
import AuthActions from '@features/auth/store/auth.action';
import { Token } from '@shared/models/common';
import { Store } from '@ngrx/store';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private message: NzMessageService,
    private cookieService: CookieService,
    private authService: AuthService,
    private store: Store
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }

        if (
          ExcludeErrorAPI.some(
            (api) => req.url.includes(api.url) && error.status === api.status
          )
        ) {
          return throwError(() => error);
        }

        this.message.error(
          `Error: ${error.error.errorMessage ?? error.message}`,
          { nzDuration: 10000 }
        );

        return throwError(() => error);
      })
    );
  }
  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.cookieService.getToken();

    return this.authService.refreshToken(token).pipe(
      filter((token) => !!token.token),
      take(1),
      switchMap((newToken: Token) => {
        const remember = this.cookieService.getCookie(REMEMBER_ME);
        this.cookieService.setToken(newToken, remember ? 7 : 1);
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken.token}`,
          },
        });
        return next.handle(clonedRequest);
      }),
      catchError((err) => {
        this.store.dispatch(AuthActions.logout());
        return throwError(() => err);
      })
    );
  }
}
