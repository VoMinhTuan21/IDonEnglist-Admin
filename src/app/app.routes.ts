import { Routes } from '@angular/router';
import { collectionRoutes } from '@features/collection/collection.routes';
import { finalTestRoutes } from '@features/final-test/final-test.routes';
import { testRoutes } from '@features/test/test.routes';
import { authRoutes } from './features/auth/auth.routes';
import { categoryRoutes } from './features/category/category.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';

export const routes: Routes = [
  ...categoryRoutes,
  ...collectionRoutes,
  ...finalTestRoutes,
  ...testRoutes,
  ...authRoutes,
  ...dashboardRoutes
];
