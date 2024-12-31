import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-box',
  standalone: true,
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BoxComponent implements OnInit {
  @Input() class: string = '';
  @Input() padding: string = '24px';
  @Input() styles: Partial<CSSStyleDeclaration> = {};

  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.container.nativeElement.setAttribute(
      'style',
      `padding: ${this.padding}`
    );
    if (this.class) {
      this.container.nativeElement.classList.add(...this.class.split(' '));
    }
  }
}
