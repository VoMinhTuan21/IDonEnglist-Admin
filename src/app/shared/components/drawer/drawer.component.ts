import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [
    NzDrawerModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class DrawerComponent {
  @Input({ required: true }) visible: boolean = false;
  @Input({ required: true }) title: string = ""
  @Output() close = new EventEmitter<void>();
  @Output() open = new EventEmitter<void>();

  handleClose() {
    this.close.emit();
  }

  handleOpen() {
    this.open.emit();
  }
}
