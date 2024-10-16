import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { categoryRoutes } from './features/category/category.routes';
import { testConfigurationRoutes } from './features/test-configuration/test-configuration.routes';

export const routes: Routes = [
  ...categoryRoutes,
  ...testConfigurationRoutes,
  ...authRoutes,
  ...dashboardRoutes
];
