import { Component } from '@angular/core';
import { CreateTestStep } from '@shared/models/enum';
import { EditorComponent } from "../../../../shared/components/editor/editor.component";
import { ChooseTestPartComponent } from './choose-test-part/choose-test-part.component';
import { CreateTestFormComponent } from './create-test-form/create-test-form.component';
import { CreateTestSectionsComponent } from './create-test-sections/create-test-sections.component';

@Component({
    selector: 'app-create-test',
    standalone: true,
    imports: [
    CreateTestFormComponent,
    ChooseTestPartComponent,
    CreateTestSectionsComponent,
    EditorComponent
],
    templateUrl: './create-test.component.html',
    styleUrl: './create-test.component.scss'
})
export class CreateTestComponent {
  createTestStepEnum = CreateTestStep;
  step: CreateTestStep = CreateTestStep.CreateSections;
}
