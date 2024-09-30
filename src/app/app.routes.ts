import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';

export const routes: Routes = [
  ...authRoutes,
  ...dashboardRoutes
];
