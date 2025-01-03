import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { TestPart } from '@features/test-part/models/test-part.model';
import {
  bootstrapCheckCircleFill,
  bootstrapCircle,
  bootstrapCollection,
  bootstrapLayoutSidebarInsetReverse,
  bootstrapRecordCircleFill,
} from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { SectionFormComponent } from '@shared/components/section-form/section-form.component';
import { SectionFormValue } from '@shared/models/common';
import { ToolList } from '@shared/models/constants';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-create-test-sections',
  standalone: true,
  imports: [
    NzButtonModule,
    SectionFormComponent,
    NzToolTipModule,
    NzStepsModule,
    NgIcon,
    NzPopoverModule,
    NzToolTipModule,
    NzIconModule,
  ],
  templateUrl: './create-test-sections.component.html',
  styleUrl: './create-test-sections.component.scss',
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    provideIcons({
      bootstrapLayoutSidebarInsetReverse,
      bootstrapCollection,
      bootstrapCheckCircleFill,
      bootstrapCircle,
      bootstrapRecordCircleFill
    }),
  ],
})
export class CreateTestSectionsComponent {
  index = 0;
  error: string | null = null;
  visible = false;
  toolItems = ToolList;

  @ViewChild(SectionFormComponent) sectionFormComponent!: SectionFormComponent;

  parts: TestPart[] = [
    {
      id: 1,
      code: 'part-1',
      duration: 30,
      name: 'Part 1',
      order: 1,
      questions: 1,
      testTypeId: 1,
    },
    {
      id: 2,
      code: 'part-2',
      duration: 30,
      name: 'Part 2',
      order: 2,
      questions: 3,
      testTypeId: 1,
    },
    {
      id: 3,
      code: 'part-3',
      duration: 30,
      name: 'Part 3',
      order: 1,
      questions: 2,
      testTypeId: 1,
    },
  ];

  partsFormValue = new Map<number, SectionFormValue>();

  handleGoToPart(index: number): void {
    if (index >= this.parts.length) {
      return;
    }

    const formValue = this.sectionFormComponent.handleSubmitForm();
    if (formValue) {
      console.log('formValue: ', formValue);
      this.partsFormValue.set(this.parts[this.index].id, formValue);

      this.index = index;
      const nextPartFormValue = this.partsFormValue.get(
        this.parts[this.index].id
      );

      if (nextPartFormValue) {
        this.sectionFormComponent.patchFormValue(nextPartFormValue);
      } else {
        this.sectionFormComponent.resetForm();
      }
    }
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  handleGoPrevious() {
    if (this.index > 0) {
      this.index--;
      const previousPartFormValue = this.partsFormValue.get(
        this.parts[this.index].id
      );
      if (previousPartFormValue) {
        this.sectionFormComponent.patchFormValue(previousPartFormValue);
      }
    }
  }

  handleCreateTest() {
    const formValue = this.sectionFormComponent.handleSubmitForm();
    if (formValue) {
      this.partsFormValue.set(this.parts[this.index].id, formValue);
    }
    console.log('partsFormValue: ', this.partsFormValue);
  }
}
