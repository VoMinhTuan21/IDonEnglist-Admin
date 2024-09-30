import { Injectable } from "@angular/core";
import { CookieService as NgxCookieService } from 'ngx-cookie-service';
import { Token } from "../../shared/models/common";
import { REFRESH_TOKEN, TOKEN } from "../../shared/models/constants";

@Injectable({providedIn: "root"})
export class CookieService {
  constructor(private cookieService: NgxCookieService) {}
  setCookie(name: string, value: string, days?: number): void {
    this.cookieService.set(name, value, days);
  }

  getCookie(name: string): string {
    return this.cookieService.get(name);
  }

  deleteCookie(name: string): void {
    this.cookieService.delete(name);
  }

  setToken(data: Token, days?: number) {
    this.setCookie(TOKEN, data.token, days);
    this.setCookie(REFRESH_TOKEN, data.refreshToken, days);
  }

  getToken() {
    const token = this.getCookie(TOKEN) ?? "";
    const refreshToken = this.getCookie(REFRESH_TOKEN) ?? "";

    return { token, refreshToken} as Token
  }

  deleteToken() {
    this.deleteCookie(TOKEN);
    this.deleteCookie(REFRESH_TOKEN);
  }
}