import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { DragDropService } from '@core/services/drag-drop.service';
import { DragItem } from '@shared/models/common';

@Directive({
  selector: '[appDraggable]',
  standalone: true
})
export class DraggableDirective {
  @Input() appDraggable?: DragItem;
  private offsetX = 0;
  private offsetY = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private dragDropService: DragDropService,
  ) {}

  @HostListener('mousedown', ['$event'])
  onDragStart(event: any): void {
    event.preventDefault();
    this.dragDropService.setDraggedItem(this.appDraggable);
    

    const rect = this.el.nativeElement.getBoundingClientRect();
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;

    // Create a clone of the item for dragging

    const clone = this.el.nativeElement.cloneNode(true);
    this.renderer.setStyle(clone, 'position', 'absolute');
    this.renderer.setStyle(clone, 'z-index', '1000');
    this.renderer.setStyle(clone, 'left', event.clientX - this.offsetX + 'px');
    this.renderer.setStyle(clone, 'top', event.clientY - this.offsetY + 'px');
    this.renderer.setStyle(clone, 'width',  rect.width + 'px');
    this.renderer.setStyle(clone, 'height',  rect.height + 'px');


    document.body.appendChild(clone);

    const moveListener = this.renderer.listen('document', 'mousemove', (moveEvent: MouseEvent) => {
      this.renderer.setStyle(clone, 'left', (moveEvent.clientX - this.offsetX) + 'px');
      this.renderer.setStyle(clone, 'top', (moveEvent.clientY - this.offsetY) + 'px');
    });

    const upListener = this.renderer.listen('document', 'mouseup', () => {
      moveListener();
      upListener();
      this.renderer.removeChild(document.body, clone);
      this.dragDropService.clearDraggedItem();
    });
  }
}