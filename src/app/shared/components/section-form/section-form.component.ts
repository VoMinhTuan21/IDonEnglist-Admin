import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { DraggableDirective } from '@core/directives/draggable.directive';
import { requiredAllFields } from '@core/validators/required-group-question-validator';
import {
  FormControlItem,
  GroupQuestionsFormValue
} from '@shared/models/common';
import { ToolList } from '@shared/models/constants';
import { EToolList } from '@shared/models/enum';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { v4 as uuidv4 } from 'uuid';
import { FormDragDropComponent } from "../form-drag-drop/form-drag-drop.component";
import { BoxComponent } from '../box/box.component';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
    selector: 'app-section-form',
    imports: [
        NzGridModule,
        DraggableDirective,
        NzFormModule,
        ReactiveFormsModule,
        NzInputModule,
        NzButtonModule,
        NzToolTipModule,
        NzCollapseModule,
        NzPopconfirmModule,
        FormDragDropComponent,
        BoxComponent,
        NzIconModule,
        NzFlexModule,
        NzTypographyModule
    ],
    templateUrl: './section-form.component.html',
    styleUrl: './section-form.component.scss',
    standalone: true,
})
export class SectionFormComponent {
  eToolList = EToolList;
  toolItems = ToolList;

  acceptedToolItemsForExtraSectionInfo = this.toolItems.filter((item) =>
    [EToolList.Direction, EToolList.Passage].includes(item.id)
  );
  excludedToolItemsForGroupQuestion = this.toolItems.filter((item) => [EToolList.Passage].includes(item.id));

  droppedItems: any[] = [];

  sectionForm = new FormGroup({
    extraSectionInfo: new FormControl({
      instruction: "Please provide the following information",
      passage: "<p>Some passage</p>",
    }, [requiredAllFields()]),
    groups: new FormArray([new FormControl({ }, [requiredAllFields()])]) as FormArray<FormControl<GroupQuestionsFormValue>>,
  })
  sectionFormControls: FormControlItem[] = [
    {
      id: uuidv4(),
      controlInstance: 'extraSectionInfo'
    },
    {
      id: uuidv4(),
      controlInstance: 'groups',
      items: [
        {
          id: uuidv4(),
        }
      ]
    }
  ];
  activePanels: boolean[] = [true];

  handleAddGroup() {
    this.sectionFormControls[1].items?.push({
      id: uuidv4(),
    });

    this.activePanels.push(true);

    (this.sectionForm.get('groups') as FormArray).push(
      new FormControl({}, [requiredAllFields()])
    );
  }

  handleRemoveGroup(groupIndex: number) {
    (this.sectionForm.get('groups') as FormArray)?.removeAt(
      groupIndex
    );
    this.sectionFormControls[1].items?.splice(groupIndex, 1);
    this.activePanels.splice(groupIndex, 1);
  }

  handleSubmitForm() {
    console.log("this.sectionForm: ", this.sectionForm);
    if (this.sectionForm.valid) {
      console.log(
        'this.groupQuestionsFormList.value: ',
        this.sectionForm.value
      );
    } else {
      Utils.markAllAsTouched(this.sectionForm);
    }
  }

  handleActivePanelChange(value: boolean, index: number) {
    this.activePanels[index] = value;
  }
}
