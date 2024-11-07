import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { categoryRoutes } from './features/category/category.routes';
import { testConfigurationRoutes } from './features/test-configuration/test-configuration.routes';
import { collectionRoutes } from '@features/collection/collection.routes';

export const routes: Routes = [
  ...categoryRoutes,
  ...testConfigurationRoutes,
  ...collectionRoutes,
  ...authRoutes,
  ...dashboardRoutes
];
