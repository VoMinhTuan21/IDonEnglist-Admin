import { Component } from '@angular/core';
import { CreateTestFormComponent } from './create-test-form/create-test-form.component';
import { CreateTestStep } from '@shared/models/enum';
import { ChooseTestPartComponent } from './choose-test-part/choose-test-part.component';
import { CreateTestSectionsComponent } from './create-test-sections/create-test-sections.component';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [
    CreateTestFormComponent,
    ChooseTestPartComponent,
    CreateTestSectionsComponent
  ],
  templateUrl: './create-test.component.html',
  styleUrl: './create-test.component.scss',
})
export class CreateTestComponent {
  createTestStepEnum = CreateTestStep;
  step: CreateTestStep = CreateTestStep.CreateSections;
}
