import { Routes } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { setLayout } from "../../core/layout/resolvers/layout-resolver";
import { PageLayout } from "../../shared/models/enum";
import { AuthGuard } from "../../core/guards/auth.guard";

export const dashboardRoutes: Routes = [{
  path: "",
  component: DashboardComponent,
  resolve: {
    layout: setLayout(PageLayout.Authorized)
  },
  data: { isAuthLayout: true },
  canActivate: [AuthGuard]
}]