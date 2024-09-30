import { Component } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-unauthorized-layout',
  standalone: true,
  imports: [NzGridModule],
  templateUrl: './unauthorized-layout.component.html',
  styleUrl: './unauthorized-layout.component.scss'
})
export class UnauthorizedLayoutComponent {

}
