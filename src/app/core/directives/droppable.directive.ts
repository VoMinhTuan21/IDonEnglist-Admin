import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { DragDropService } from '@core/services/drag-drop.service';
import { DragItem } from '@shared/models/common';

@Directive({
  selector: '[appDroppable]',
  standalone: true,
})
export class DroppableDirective implements OnInit, OnDestroy, OnChanges {
  @Input() appDroppable: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() acceptList?: DragItem[];
  @Input() excludeList?: DragItem[];
  @Input() errorMessage?: string;
  @Output() itemDropped = new EventEmitter<DragItem>();

  dropCover!: HTMLDivElement;
  private isDraggingOver = false;
  private isItemAllowed = true;
  private observer: MutationObserver;
  private isUpdating = false;
  private dropCoverDom: HTMLDivElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private dragDropService: DragDropService,
  ) {
    this.dropCover = this.renderer.createElement('div');
    this.renderer.addClass(this.dropCover, 'drop-cover');
    this.renderer.setProperty(this.dropCover, 'textContent', 'Drop item here');
    this.observer = new MutationObserver(() => {
      if (!this.isUpdating) {
        this.updateDropCover();
      }
    });
  }

  private notHasChildren() {
    return (
      (this.el.nativeElement.hasChildNodes() &&
      Array.from(this.el.nativeElement.childNodes).filter(
        (node: any) => {
            return node.nodeName !== '#comment' && !(Array.from(node.classList ?? []) as string[]).includes('drop-cover')}
        ).length === 0) ||
      !this.el.nativeElement.hasChildNodes()
    );
  }

  private updateDropCover() {
    this.isUpdating = true;
    // this.observer.disconnect();
    if (this.notHasChildren()) {
      this.dropCoverDom?.classList.remove('drop-cover--hidden');
    } else {
      this.dropCoverDom?.classList.add('drop-cover--hidden');
    }

    this.isUpdating = false;
  }

  ngOnInit(): void {
    this.observer.observe(this.el.nativeElement, { childList: true});
    this.renderer.appendChild(this.el.nativeElement, this.dropCover);
    this.dropCoverDom = this.el.nativeElement.getElementsByClassName('drop-cover')?.[0] as HTMLDivElement;

    if (!this.notHasChildren()) {
      this.dropCoverDom?.classList.add('drop-cover--hidden');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      if (changes['errorMessage']) {
        if (this.dropCoverDom) {
          if (changes['errorMessage'].currentValue) {
            this.renderer.addClass(this.dropCoverDom, 'drop-cover--error');
            this.renderer.setProperty(
              this.dropCoverDom,
              'textContent',
              this.errorMessage?.trim()
            );
          } else {
            this.renderer.removeClass(this.dropCoverDom, 'drop-cover--error');
            this.renderer.setProperty(
              this.dropCoverDom,
              'textContent',
              'Drop item here'
            );
          }
        }
      }
    }, 200);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  onDragEnter(event: MouseEvent): void {
    event.preventDefault();
    this.dropCoverDom?.classList.remove('drop-cover--hidden');
    if (this.appDroppable && this.dragDropService.draggedItem) {
      if (!this.dropCoverDom) {
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
        this.dropCoverDom = this.el.nativeElement.getElementsByClassName('drop-cover')?.[0] as HTMLDivElement;
      } else {
        if (this.isItemAllowed) {
          this.renderer.removeClass(this.dropCoverDom, 'drop-cover--error');
          this.renderer.setProperty(
            this.dropCoverDom,
            'textContent',
            'Drop item here'
          );
        } else {
          this.renderer.addClass(this.dropCoverDom, 'drop-cover--error');
          this.renderer.setProperty(
            this.dropCoverDom,
            'innerHTML',
            'Item is not allowed'
          );
        }
      }
    }
  }

  onDragLeave(event: MouseEvent): void {
    event.preventDefault();
    if (!this.notHasChildren()) {
      this.dropCoverDom?.classList.add('drop-cover--hidden');
    } else {
      if (this.errorMessage) {
        this.renderer.addClass(this.dropCover, 'drop-cover--error');
        this.renderer.setProperty(
          this.dropCover,
          'textContent',
          this.errorMessage?.trim()
        );
      } else {
        this.renderer.removeClass(this.dropCover, 'drop-cover--error');
        this.renderer.setProperty(
          this.dropCover,
          'textContent',
          'Drop item here'
        );
      }
      this.dropCoverDom?.classList.remove('drop-cover--hidden');
    }
  }

  // Listen for mousemove events on the document to track dragging
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDisabled) {
      return;
    }

    if (this.dragDropService.draggedItem) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const isOver =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (isOver) {
        this.isDraggingOver = true;
        if (this.acceptList?.length) {
          const toolItem = this.acceptList.find(
            (item) => item.id === this.dragDropService.draggedItem?.id
          );
          this.isItemAllowed = !!toolItem ? true : false;
        }

        if (this.excludeList?.length) {
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
    if (this.isDisabled) {
      return;
    }

    event.preventDefault();
    if (this.appDroppable && this.dragDropService.draggedItem) {
      if (this.isItemAllowed && this.isDraggingOver) {
        this.itemDropped.emit(this.dragDropService.draggedItem);
        this.dragDropService.clearDraggedItem();
      }
    }

    const rect = this.el.nativeElement.getBoundingClientRect();
    const isOver =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    this.isDraggingOver = isOver;
    
    if (this.isDraggingOver) {
      setTimeout(() => {
        this.onDragLeave(event);
      }, 100);
    }

    this.isItemAllowed = true;
  }
}
