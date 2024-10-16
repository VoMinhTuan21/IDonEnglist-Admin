import { Injectable } from "@angular/core";
import { HttpService } from "../../core/http/http.service";
import { Observable } from "rxjs";
import AuthAPI from "./api/auth.api";
import { LoginRequest, LoginResponse } from "./models/login.model";
import { Token } from "../../shared/models/common";
import { CookieService } from "../../core/services/cookie.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private httpService: HttpService, private cookieService: CookieService) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.httpService.post(AuthAPI.login, data)
  }
  
  refreshToken(data: Token): Observable<Token> {
    return this.httpService.post(AuthAPI.refreshToken, data);
  }
}