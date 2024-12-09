import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BoxComponent } from '@shared/components/box/box.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Editor, NgxEditorModule, schema, Toolbar } from 'ngx-editor';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormDragDropComponent } from '@shared/components/form-drag-drop/form-drag-drop.component';

@Component({
  selector: 'app-create-test-sections',
  standalone: true,
  imports: [
    NzGridModule,
    BoxComponent,
    NzButtonModule,
    NzTabsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NgxEditorModule,
    FormsModule,
    NzIconModule,
    FormDragDropComponent
  ],
  templateUrl: './create-test-sections.component.html',
  styleUrl: './create-test-sections.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreateTestSectionsComponent implements OnInit, OnDestroy {
  tabs = ['Section 1', 'Section 2'];
  activatedTabIndex = 0;
  

  selectedIndex = 0;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  html = 'Hello world!';

  sectionForm: FormGroup<{
    instruction: FormControl<string | null>,
    passage: FormControl<any>
  }> = new FormGroup({
    instruction: new FormControl(""),
    passage: new FormControl({value: null, disabled: false})
  });

  constructor(private readonly fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.editor = new Editor({history: true, content: '', schema});
  }

  ngOnDestroy(): void {
      this.editor.destroy();
  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  newTab(): void {
    this.tabs.push(`Section ${this.tabs.length + 1}`);
    this.selectedIndex = this.tabs.length;
  }

  onSubmit() {
    console.log(this.sectionForm.value);
  }
}
