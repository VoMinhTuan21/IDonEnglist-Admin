import { Injectable } from '@angular/core';
import { DragItem } from '@shared/models/common';

@Injectable({
  providedIn: 'root',
})

export class DragDropService {
  public draggedItem: DragItem | null = null;

  constructor() {}

  setDraggedItem(item?: DragItem): void {
    this.draggedItem = item ?? null;
  }

  clearDraggedItem(): void {
    this.draggedItem = null;
  }
}
