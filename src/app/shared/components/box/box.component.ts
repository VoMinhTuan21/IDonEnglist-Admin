import { Component, ElementRef, HostBinding, Input, OnInit, Renderer2, ViewChild, viewChild } from '@angular/core';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [],
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss'
})
export class BoxComponent implements OnInit {
  @Input() padding: string = '24px';

  @ViewChild("container", {static: true}) container!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
      this.container.nativeElement.setAttribute("style", `padding: ${this.padding}`);
  }
}
