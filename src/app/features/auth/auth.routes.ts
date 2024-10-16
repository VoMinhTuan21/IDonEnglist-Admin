import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { setLayout } from '@core/layout/resolvers/layout-resolver';
import { PageLayout } from '@shared/models/enum';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      layout: setLayout(PageLayout.UnAuthorized),
    },
    data: { isAuthLayout: false },
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    resolve: {
      layout: setLayout(PageLayout.UnAuthorized),
    },
    data: { isAuthLayout: false },
    canActivate: [AuthGuard],
  },
];
