import { Component } from '@angular/core';
import { CreateTestStep } from '@shared/models/enum';
import { CreateTestFormComponent } from './create-test-form/create-test-form.component';
import { CreateTestSectionsComponent } from './create-test-sections/create-test-sections.component';

@Component({
    selector: 'app-create-test',
    standalone: true,
    imports: [
    CreateTestFormComponent,
    CreateTestSectionsComponent
],
    templateUrl: './create-test.component.html',
    styleUrl: './create-test.component.scss'
})
export class CreateTestComponent {
  createTestStepEnum = CreateTestStep;
  step: CreateTestStep = CreateTestStep.CreateTest;
}
