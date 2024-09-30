import { Injectable } from "@angular/core";
import { HttpService } from "../../core/http/http.service";
import { Observable } from "rxjs";
import AuthAPI from "./api/auth.api";
import { LoginRequest, LoginResponse } from "./models/login.model";
import { Token } from "../../shared/models/common";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private httpService: HttpService) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.httpService.post(AuthAPI.login, data)
  }
  
  refreshToken(data: Token): Observable<Token> {
    return this.httpService.post(AuthAPI.refreshToken, data);
  }
}