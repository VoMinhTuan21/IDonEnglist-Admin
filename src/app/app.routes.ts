import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { categoryRoutes } from './features/category/category.routes';
import { testConfigurationRoutes } from './features/test-configuration/test-configuration.routes';
import { collectionRoutes } from '@features/collection/collection.routes';
import { finalTestRoutes } from '@features/final-test/final-test.routes';
import { testRoutes } from '@features/test/test.routes';

export const routes: Routes = [
  ...categoryRoutes,
  ...testConfigurationRoutes,
  ...collectionRoutes,
  ...finalTestRoutes,
  ...testRoutes,
  ...authRoutes,
  ...dashboardRoutes
];
