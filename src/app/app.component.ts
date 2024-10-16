import { AsyncPipe } from '@angular/common';
import { } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  RouterOutlet
} from '@angular/router';
import { AuthorizedLayoutComponent } from './core/layout/authorized-layout/authorized-layout.component';
import { UnauthorizedLayoutComponent } from './core/layout/unauthorized-layout/unauthorized-layout.component';
import { PageLayoutService } from './core/services/page-layout.service';
import { PageLayout } from './shared/models/enum';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    UnauthorizedLayoutComponent,
    AsyncPipe,
    AuthorizedLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'IDonEnglist-Admin';
  readonly PageLayout = PageLayout;
  constructor(
    public pageLayoutService: PageLayoutService
  ) {}
}
