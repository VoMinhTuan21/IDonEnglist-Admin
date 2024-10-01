import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { PageLayout } from "../../shared/models/enum";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "./pages/forgot-password/verify-email/verify-email.component";
import { CreateNewPassComponent } from "./pages/forgot-password/create-new-pass/create-new-pass.component";
import { setLayout } from "../../core/layout/resolvers/layout-resolver";
import { AuthGuard } from "../../core/guards/auth.guard";

export const authRoutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    resolve: {
      layout: setLayout(PageLayout.UnAuthorized)
    },
    data: { isAuthLayout: false },
    canActivate: [AuthGuard]
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    resolve: {
      layout: setLayout(PageLayout.UnAuthorized)
    },
    data: { isAuthLayout: false },
    canActivate: [AuthGuard]
  },
]