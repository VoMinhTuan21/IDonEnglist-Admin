import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { setLayout } from '@core/layout/resolvers/layout-resolver';
import { PageLayout } from '@shared/models/enum';
import { CategoryComponent } from './pages/category/category.component';

export const categoryRoutes: Routes = [
  {
    path: 'category',
    component: CategoryComponent,
    resolve: {
      layout: setLayout(PageLayout.Authorized),
    },
    data: { isAuthLayout: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'category/:code',
    component: CategoryComponent,
    resolve: {
      layout: setLayout(PageLayout.Authorized),
    },
    data: { isAuthLayout: true },
    canActivate: [AuthGuard],
  },
];
