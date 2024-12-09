import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {
  Editor,
  NgxEditorModule,
  Toolbar
} from 'ngx-editor';

@Component({
  selector: 'app-text-editor-input',
  standalone: true,
  imports: [NgxEditorModule, ReactiveFormsModule, FormsModule],
  templateUrl: './text-editor-input.component.html',
  styleUrl: './text-editor-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorInputComponent),
      multi: true
    }
  ]
})
export class TextEditorInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() placeholder: string = 'Enter text here...';
  content: string = '';
  isDisabled: boolean = false;

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['image'],
    ['text_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  editor!: Editor;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.content = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
    console.log("fn: ", fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // setDisabledState(isDisabled: boolean): void {
  //   if (isDisabled) {
  //     this.editor.disable();
  //   } else {
  //     this.editor.enable();
  //   }
  // }

  onContentChange(value: string): void {
    this.content = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
