import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { CookieService } from "../services/cookie.service";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import AuthActions from "../../features/auth/store/auth.action";
import { selectUser } from "../../features/auth/store/auth.selector";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private cookieService: CookieService, private store: Store, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const isAuthLayout = route.data["isAuthLayout"];
    const token = this.cookieService.getToken();

    if (isAuthLayout) {

      if (!token.refreshToken || !token.token) {
        this.router.navigate(["/login"])
        return of(false);
      }
    } else {
      if (token.refreshToken && token.token) {
        this.store.dispatch(AuthActions.refreshToken(token));
        this.router.navigate(["/"]);
        return of(false)
      }
    }

    return of(true);
  }
  
}