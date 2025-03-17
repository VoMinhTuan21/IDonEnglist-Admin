import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable
} from 'rxjs';
import { CookieService } from '../services/cookie.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
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

      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
