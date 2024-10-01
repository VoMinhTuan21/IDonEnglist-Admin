import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-authorized-layout',
  standalone: true,
  imports: [NzLayoutModule, NzBreadCrumbModule, NzMenuModule, NzIconModule],
  templateUrl: './authorized-layout.component.html',
  styleUrl: './authorized-layout.component.scss'
})
export class AuthorizedLayoutComponent {

}
