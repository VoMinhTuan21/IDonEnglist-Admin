import { NgStyle } from '@angular/common';
import { Component, ElementRef, HostBinding, Input, OnInit, Renderer2, ViewChild, viewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [],
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BoxComponent implements OnInit {
  @Input() padding: string = '24px';
  @Input() styles: Partial<CSSStyleDeclaration> = {};

  @ViewChild("container", {static: true}) container!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
      this.container.nativeElement.setAttribute("style", `padding: ${this.padding}`);
  }
}
