import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
    selector: 'app-text-editor-input',
    standalone: true,
    imports: [NgxEditorModule, ReactiveFormsModule, FormsModule, CommonModule],
    templateUrl: './text-editor-input.component.html',
    styleUrl: './text-editor-input.component.scss',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextEditorInputComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => TextEditorInputComponent),
            multi: true,
        },
    ]
})
export class TextEditorInputComponent
  implements ControlValueAccessor, OnInit, OnDestroy, Validator
{
  @Input() placeholder: string = 'Enter text here...';
  content: string = '';
  isDisabled: boolean = false;
  errorClass = 'text-editor--error';
  control: AbstractControl | null = null;

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
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

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

  validate(control: AbstractControl): ValidationErrors | null {
    this.control = control;
    return null;
  }

  get isInvalid(): boolean {
    return this.control ? this.control.invalid && (this.control.dirty || this.control.touched) : false;
  }
}
