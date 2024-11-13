import { Routes } from "@angular/router";
import { CollectionListComponent } from "./pages/collection-list/collection-list.component";
import { setLayout } from "@core/layout/resolvers/layout-resolver";
import { PageLayout } from "@shared/models/enum";
import { AuthGuard } from "@core/guards/auth.guard";

export const collectionRoutes: Routes = [
  {
    path: "collection",
    component: CollectionListComponent,
    resolve: {
      layout: setLayout(PageLayout.Authorized)
    },
    data: { isAuthLayout: true },
    canActivate: [AuthGuard]
  }
]