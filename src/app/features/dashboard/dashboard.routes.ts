import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { setLayout } from '@core/layout/resolvers/layout-resolver';
import { PageLayout } from '@shared/models/enum';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      layout: setLayout(PageLayout.Authorized),
    },
    data: { isAuthLayout: true },
    canActivate: [AuthGuard],
  },
];
