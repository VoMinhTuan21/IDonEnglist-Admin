import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLayoutService } from './core/services/page-layout.service';
import { UnauthorizedLayoutComponent } from './core/layout/unauthorized-layout/unauthorized-layout.component';
import { PageLayout } from './shared/models/enum';
import { AsyncPipe } from '@angular/common';
import { AuthorizedLayoutComponent } from './core/layout/authorized-layout/authorized-layout.component';
import {} from '@angular/common/http';
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
  constructor(public pageLayoutService: PageLayoutService) {}
}
