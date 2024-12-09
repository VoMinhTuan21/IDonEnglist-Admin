import { Routes } from "@angular/router";
import { setLayout } from "@core/layout/resolvers/layout-resolver";
import { PageLayout } from "@shared/models/enum";
import { AuthGuard } from "@core/guards/auth.guard";
import { CreateTestComponent } from "./pages/create-test/create-test.component";

export const testRoutes: Routes = [
  {
    path: 'test/create',
    component: CreateTestComponent,
    resolve: {
      layout: setLayout(PageLayout.Authorized),
    },
    data: { isAuthLayout: true },
    canActivate: [AuthGuard]
  }
]