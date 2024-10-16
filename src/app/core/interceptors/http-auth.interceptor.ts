import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from '../services/cookie.service';
import {
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Store } from '@ngrx/store';
import AuthActions from '../../features/auth/store/auth.action';
import { AuthService } from '../../features/auth/auth.service';
import { Token } from '../../shared/models/common';
import { REMEMBER_ME } from '../../shared/models/constants';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    private store: Store,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.cookieService.getToken();

    if (token.token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token.token}`,
        },
      });

      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return this.handle401Error(req, next);
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
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
