import { Component, ViewEncapsulation } from '@angular/core';
import { SectionFormComponent } from '@shared/components/section-form/section-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
    selector: 'app-create-test-sections',
    standalone: true,
    imports: [
        NzButtonModule,
        SectionFormComponent
    ],
    templateUrl: './create-test-sections.component.html',
    styleUrl: './create-test-sections.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class CreateTestSectionsComponent {
}
