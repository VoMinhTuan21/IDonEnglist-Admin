import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
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
import {
  FillInBlankTextEditorOutput,
  FillInTheBlankQuestionFormValue,
} from '@shared/models/common';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FillInBlankTextEditorComponent } from '../fill-in-blank-text-editor/fill-in-blank-text-editor.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Utils } from '@shared/utils/utils';

@Component({
  selector: 'app-fill-in-the-blank-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzFlexModule,
    FillInBlankTextEditorComponent,
    NzPopconfirmModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './fill-in-the-blank-input.component.html',
  styleUrl: './fill-in-the-blank-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FillInTheBlankInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FillInTheBlankInputComponent),
      multi: true
    }
  ],
})
export class FillInTheBlankInputComponent implements ControlValueAccessor, Validator {
  @Input() label: string = '';
  @Output() removeControl = new EventEmitter();

  constructor() {}

  value: FillInBlankTextEditorOutput = { text: '', answers: [] };
  shouldValidate = 0;

  private onChange: (value: FillInTheBlankQuestionFormValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: FillInTheBlankQuestionFormValue): void {
    this.value = {
      text: obj.text,
      answers: [obj.answer],
    };
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  onInput(value: FillInBlankTextEditorOutput) {
    this.value = value;
    this.onChange({
      text: value.text,
      answer: value.answers.length > 0 ? value.answers[0] : '',
    });
  }

  confirmDeleteQuestion() {
    this.removeControl.emit();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (Utils.isObjectHasEmptyField(this.value)) {
      this.shouldValidate = Math.round(Math.random() * 1000000);
      return { required: true }
    }
    
    this.shouldValidate = 0;
    return null;
  }
}
