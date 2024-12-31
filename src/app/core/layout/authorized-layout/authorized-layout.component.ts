import { Component } from '@angular/core';
import {
  RouterLink
} from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
@Component({
    selector: 'app-authorized-layout',
    standalone: true,
    imports: [
        NzLayoutModule,
        NzBreadCrumbModule,
        NzMenuModule,
        NzIconModule,
        RouterLink,
        RouterLink
    ],
    templateUrl: './authorized-layout.component.html',
    styleUrl: './authorized-layout.component.scss'
})
export class AuthorizedLayoutComponent{
  isCollapse = false;

  handleCollapseChange = (value: boolean) => {
    this.isCollapse = value;
  };
}
