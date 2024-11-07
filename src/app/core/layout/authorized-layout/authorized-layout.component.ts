import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink
} from '@angular/router';
import { Store } from '@ngrx/store';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { selectUser } from '../../../features/auth/store/auth.selector';
@Component({
  selector: 'app-authorized-layout',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMenuModule,
    NzIconModule,
    RouterLink,
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './authorized-layout.component.html',
  styleUrl: './authorized-layout.component.scss',
})
export class AuthorizedLayoutComponent{
  isCollapse = false;

  handleCollapseChange = (value: boolean) => {
    this.isCollapse = value;
  };
}
