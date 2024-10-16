import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.baseUrl; // Your API base URL

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, params?:  HttpParams | { [key: string]: string | number | boolean }): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      if (params instanceof HttpParams) {
        httpParams = params;
      } else {
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            httpParams = httpParams.append(key, params[key].toString());
          }
        }
      }
    }
    return this.http.get<T>(`${this.baseUrl}/api/${endpoint}`, { params: httpParams });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/api/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/api/${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/api/${endpoint}`);
  }
}
