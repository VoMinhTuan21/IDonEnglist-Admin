import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private message: NzMessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("error: ", error);
        if (error.error instanceof ErrorEvent) {
          this.message.error("An error occured: " + error.error.message);
        } else {
          this.message.error(`Error ${error.status}: ${error.error.errorMessage ?? error.message}`);
        }

        return throwError(() => error);
      })
    )
  }
  
}