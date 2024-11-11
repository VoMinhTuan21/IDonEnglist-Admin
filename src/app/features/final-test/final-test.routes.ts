import { Routes } from '@angular/router';
import { FinalTestListComponent } from './pages/final-test-list/final-test-list.component';
import { setLayout } from '@core/layout/resolvers/layout-resolver';
import { PageLayout } from '@shared/models/enum';
import { AuthGuard } from '@core/guards/auth.guard';

export const finalTestRoutes: Routes = [
  {
    path: 'final-test',
    component: FinalTestListComponent,
    resolve: {
      layout: setLayout(PageLayout.Authorized),
    },
    data: { isAuthLayout: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'final-test/:id',
    component: FinalTestListComponent,
    resolve: {
      layout: setLayout(PageLayout.Authorized),
    },
    data: { isAuthLayout: true },
    canActivate: [AuthGuard],
  },
];
