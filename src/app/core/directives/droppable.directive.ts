import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { DragDropService } from '@core/services/drag-drop.service';
import { DragItem } from '@shared/models/common';

@Directive({
  selector: '[appDroppable]',
  standalone: true,
})
export class DroppableDirective implements OnInit {
  @Input() appDroppable: boolean = false;
  @Input() acceptList?: DragItem[];
  @Input() excludeList?: DragItem[];
  @Output() itemDropped = new EventEmitter<DragItem>();

  dropCover!: HTMLDivElement;
  private isDraggingOver = false;
  private isItemAllowed = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private dragDropService: DragDropService
  ) {
    this.dropCover = this.renderer.createElement('div');
    this.renderer.addClass(this.dropCover, 'drop-cover');
    this.renderer.setProperty(this.dropCover, 'textContent', 'Drop item here');
  }

  private notHasChildren() {
    return (
      (this.el.nativeElement.hasChildNodes() &&
        Array.from(this.el.nativeElement.childNodes).filter(
          (node: any) => node.nodeName !== '#comment' && node != this.dropCover
        ).length === 0) ||
      !this.el.nativeElement.hasChildNodes()
    );
  }

  ngOnInit(): void {
    if (this.notHasChildren()) {
      this.renderer.appendChild(this.el.nativeElement, this.dropCover);
    }
  }

  onDragEnter(event: MouseEvent): void {
    event.preventDefault();
    if (this.appDroppable && this.dragDropService.draggedItem) {
      if (this.isItemAllowed) {
        this.renderer.removeClass(this.dropCover, 'drop-cover--error');
        this.renderer.setProperty(
          this.dropCover,
          'textContent',
          'Drop item here'
        );
      } else {
        this.renderer.addClass(this.dropCover, 'drop-cover--error');
        this.renderer.setProperty(
          this.dropCover,
          'innerHTML',
          'Item is not allowed'
        );
      }
      this.renderer.appendChild(this.el.nativeElement, this.dropCover);
    }
  }

  onDragLeave(event: MouseEvent): void {
    event.preventDefault();
    if (!this.notHasChildren()) {
      this.renderer.removeChild(this.el.nativeElement, this.dropCover);
    } else {
      this.renderer.removeClass(this.dropCover, 'drop-cover--error');
      this.renderer.setProperty(
        this.dropCover,
        'textContent',
        'Drop item here'
      );
      this.renderer.appendChild(this.el.nativeElement, this.dropCover);
    }
  }

  // Listen for mousemove events on the document to track dragging
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragDropService.draggedItem) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const isOver =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (isOver) {
        this.isDraggingOver = true;
        if (this.acceptList) {
          const toolItem = this.acceptList.find(
            (item) => item.id === this.dragDropService.draggedItem?.id
          );
          this.isItemAllowed = !!toolItem;
        }

        if (this.excludeList) {
          const toolItem = this.excludeList.find(
            (item) => item.id === this.dragDropService.draggedItem?.id
          );
          this.isItemAllowed = !!toolItem ? false : true;
        }
        this.onDragEnter(event);
      } else {
        this.isDraggingOver = false;
        this.onDragLeave(event);
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onDrop(event: MouseEvent): void {
    event.preventDefault();
    if (this.appDroppable && this.dragDropService.draggedItem) {
      if (this.isItemAllowed && this.isDraggingOver) {
        this.itemDropped.emit(this.dragDropService.draggedItem);
        this.dragDropService.clearDraggedItem();
      }
    }

    setTimeout(() => {
      this.onDragLeave(event);
    }, 100);

    this.isItemAllowed = true;
  }
}
