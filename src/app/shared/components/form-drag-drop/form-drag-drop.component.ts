import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DraggableDirective } from '@core/directives/draggable.directive';
import { DroppableDirective } from '@core/directives/droppable.directive';
import { ToolLabelPipe } from '@core/pipes/tool-label.pipe';
import {
  DragItem,
  FormControlItem,
  GroupQuestionsFormValue
} from '@shared/models/common';
import { ToolList } from '@shared/models/constants';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Validators as EditorValidator } from 'ngx-editor';
import { v4 as uuidv4 } from 'uuid';
import { QuestionsGroupInputComponent } from './questions-group-input/questions-group-input.component';
import { TextEditorInputComponent } from './text-editor-input/text-editor-input.component';
import { EToolList } from '@shared/models/enum';

@Component({
  selector: 'app-form-drag-drop',
  standalone: true,
  imports: [
    NzGridModule,
    DraggableDirective,
    DroppableDirective,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    ToolLabelPipe,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    NzCollapseModule,
    NzPopconfirmModule,
    TextEditorInputComponent,
    QuestionsGroupInputComponent,
  ],
  templateUrl: './form-drag-drop.component.html',
  styleUrl: './form-drag-drop.component.scss',
})
export class FormDragDropComponent {
  eToolList = EToolList;
  toolItems = ToolList;
  acceptedItemsToolForSection = this.toolItems.filter((item) =>
    [EToolList.Direction, EToolList.Passage].includes(item.id)
  );

  droppedItems: any[] = [];

  sectionForm: FormGroup<any> = new FormGroup<any>({});
  listOfSectionFormControls: FormControlItem[] = [];

  groupQuestionsFormList: FormGroup<{
    groups: FormArray<FormControl<GroupQuestionsFormValue>>;
  }> = new FormGroup({
    groups: new FormArray([new FormControl()]),
  });

  listOfFormGroupsFormListControl: FormControlItem[] = [
    {
      id: uuidv4(),
    },
  ];

  handleItemDroppedForSectionForm(event: DragItem) {
    switch (event.id) {
      case EToolList.Direction:
        this.listOfSectionFormControls.push({
          id: uuidv4(),
          controlType: EToolList.Direction,
          controlInstance: 'instruction',
        });
        this.sectionForm.addControl(
          'instruction',
          new FormControl(null, [Validators.required])
        );
        break;
      case EToolList.Passage:
        this.listOfSectionFormControls.push({
          id: uuidv4(),
          controlType: EToolList.Passage,
          controlInstance: 'passage',
        });
        this.sectionForm.addControl(
          'passage',
          new FormControl(null, [EditorValidator.required()])
        );
        break;
      default:
        break;
    }
  }

  handleAddGroup() {
    this.listOfFormGroupsFormListControl.push({
      id: uuidv4(),
    });

    (this.groupQuestionsFormList.get('groups') as FormArray).push(
      new FormControl()
    );
  }

  handleRemoveGroup(groupIndex: number) {
    (this.groupQuestionsFormList.get('groups') as FormArray)?.removeAt(
      groupIndex
    );
    this.listOfFormGroupsFormListControl.splice(groupIndex, 1);
  }

  handleSubmitSectionForm() {
    console.log('this.sectionForm.value: ', this.sectionForm.value);
  }

  handleSubmitGroupQuestionsListForm() {
    console.log(
      'this.groupQuestionsFormList.value: ',
      this.groupQuestionsFormList.value
    );
  }
}
