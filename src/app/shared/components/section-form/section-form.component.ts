import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, TemplateRef } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DraggableDirective } from '@core/directives/draggable.directive';
import { requiredAllFields } from '@core/validators/required-group-question-validator';
import { bootstrapGear } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  FormControlItem,
  SectionForm,
  SectionFormValue,
} from '@shared/models/common';
import { ToolList } from '@shared/models/constants';
import { EToolList } from '@shared/models/enum';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Subject, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { BoxComponent } from '../box/box.component';
import { FormDragDropComponent } from '../form-drag-drop/form-drag-drop.component';

@Component({
  selector: 'app-section-form',
  imports: [
    NzGridModule,
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
    NzTypographyModule,
    NzSpaceModule,
    NzPopoverModule,
    NgIcon,
    DraggableDirective,
    CommonModule,
  ],
  templateUrl: './section-form.component.html',
  styleUrl: './section-form.component.scss',
  standalone: true,
  viewProviders: [provideIcons({ bootstrapGear })],
})
export class SectionFormComponent implements OnDestroy {
  @Input() numberOfQuestions = 0;
  @Input() partsMenu: TemplateRef<any> | null = null;

  countedQuestions = 0;

  $unsubscribe = new Subject<void>();

  toolItems = ToolList;

  acceptedToolItemsForExtraSectionInfo = this.toolItems.filter((item) =>
    [EToolList.Direction, EToolList.Passage].includes(item.id)
  );
  excludedToolItemsForGroupQuestion = this.toolItems.filter((item) =>
    [EToolList.Passage].includes(item.id)
  );

  droppedItems: any[] = [];

  sectionForm!: SectionForm;

  sectionFormControls!: FormControlItem[];

  activePanels: boolean[] = [true];

  constructor() {
    this.initForm();

    this.sectionForm.valueChanges
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((value) => {
        if (value.groups) {
          this.countedQuestions = Utils.countQuestions(value.groups);
        }
      });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

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
    (this.sectionForm.get('groups') as FormArray)?.removeAt(groupIndex);
    this.sectionFormControls[1].items?.splice(groupIndex, 1);
    this.activePanels.splice(groupIndex, 1);
  }

  handleSubmitForm() {
    if (this.sectionForm.valid) {
      return this.sectionForm.value;
    } else {
      Utils.markAllAsTouched(this.sectionForm);
    }

    return null;
  }

  handleActivePanelChange(value: boolean, index: number) {
    this.activePanels[index] = value;
  }

  initForm() {
    this.sectionForm = new FormGroup({
      extraSectionInfo: new FormControl(
        {
          instruction:
            'Please read the following passage and answer the questions that follow.',
          passage:
            '<p>The passage is about the history of the United States of America.</p>',
        },
        [requiredAllFields()]
      ),
      groups: new FormArray([new FormControl({}, [requiredAllFields()])]),
    }) as FormGroup;

    this.sectionFormControls = [
      {
        id: uuidv4(),
        controlInstance: 'extraSectionInfo',
      },
      {
        id: uuidv4(),
        controlInstance: 'groups',
        items: [
          {
            id: uuidv4(),
          },
        ],
      },
    ];
  }

  resetForm() {
    while ((this.sectionForm.get('groups') as FormArray).length > 1) {
      (this.sectionForm.get('groups') as FormArray).removeAt(1);
    };

    this.sectionForm.patchValue({
      extraSectionInfo: {},
      groups: [{}],
    });

    this.sectionFormControls = [
      {
        id: uuidv4(),
        controlInstance: 'extraSectionInfo',
      },
      {
        id: uuidv4(),
        controlInstance: 'groups',
        items: [
          {
            id: uuidv4(),
          },
        ],
      },
    ];
  }

  patchFormValue(value: SectionFormValue) {
    if (value.groups) {
      const countGroups = (this.sectionForm.get('groups') as FormArray).length;
      if (countGroups > value.groups.length) {
        while ((this.sectionForm.get('groups') as FormArray).length > value.groups.length) {
          (this.sectionForm.get('groups') as FormArray).removeAt(1);
        }
      } else {
        while ((this.sectionForm.get('groups') as FormArray).length < value.groups.length) {
          (this.sectionForm.get('groups') as FormArray).push(
            new FormControl({}, [requiredAllFields()])
          );
        }
      };

      this.sectionForm.patchValue(value);

      this.sectionFormControls[1].items = value.groups.map(() => ({
        id: uuidv4(),
      }));

    }
  }
}
