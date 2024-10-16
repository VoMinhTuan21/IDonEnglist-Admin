import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';

export type ItemDragDrop = {
  label: string;
  id: string
}

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [CommonModule, NzTagModule],
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.scss'
})
export class DragDropComponent {
  @Input({required: true}) items!: Array<ItemDragDrop>;
  @Output() itemsChange = new EventEmitter<ItemDragDrop[]>();
  @Output() itemDelete = new EventEmitter<number>();

  draggedItemIndex: number | null = null;
  overItemIndex: number | null = null;

  onDragStart(index: number) {
    this.draggedItemIndex = index;
  }

  onDragOver(index: number) {
    this.overItemIndex = index;
  }

  onDragLeave() {
    this.overItemIndex = null;
  }

  onDrop(index: number) {
    if (this.draggedItemIndex !== null) {
      const movedItem = this.items[this.draggedItemIndex];
      this.items.splice(this.draggedItemIndex, 1);
      this.items.splice(index, 0, movedItem);
      this.draggedItemIndex = null;
      this.overItemIndex = null;
      this.itemsChange.emit(this.items);
    }
  }

  onDelete(index: number) {
    this.itemDelete.emit(index);
  }
}
