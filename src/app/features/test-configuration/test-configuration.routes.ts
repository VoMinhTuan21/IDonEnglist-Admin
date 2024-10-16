import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { setLayout } from '@core/layout/resolvers/layout-resolver';
import { PageLayout } from '@shared/models/enum';
import { CreateTestConfigurationComponent } from './pages/create-test-configuration/create-test-configuration.component';
import { TestConfigurationListComponent } from './pages/test-configuration-list/test-configuration-list.component';

export const testConfigurationRoutes: Routes = [
  {
    path: 'test-configuration',
    component: TestConfigurationListComponent,
    resolve: {
      layout: setLayout(PageLayout.Authorized),
    },
    data: { isAuthLayout: true },
    canActivate: [AuthGuard],
  },
  {
    path: 'test-configuration/create',
    component: CreateTestConfigurationComponent,
    resolve: {
      layout: setLayout(PageLayout.Authorized),
    },
    data: { isAuthLayout: true },
    canActivate: [AuthGuard],
  },
];
