import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExcludeErrorAPI } from "@shared/models/constants";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private message: NzMessageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (ExcludeErrorAPI.some((api) => req.url.includes(api.url) && error.status === api.status)) {
          return throwError(() => error);
        }

        console.log("error: ", error);
        this.message.error(`Error: ${error.error.errorMessage ?? error.message}`, { nzDuration: 10000 });

        return throwError(() => error);
      })
    )
  }

}