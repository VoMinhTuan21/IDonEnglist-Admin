import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FillInBlankTextEditorOutput, FillInTheBlankQuestionFormValue } from '@shared/models/common';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FillInBlankTextEditorComponent } from "../fill-in-blank-text-editor/fill-in-blank-text-editor.component";

@Component({
  selector: 'app-fill-in-the-blank-input',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NzFormModule, NzFlexModule, FillInBlankTextEditorComponent],
  templateUrl: './fill-in-the-blank-input.component.html',
  styleUrl: './fill-in-the-blank-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FillInTheBlankInputComponent),
      multi: true,
    },
  ],
})
export class FillInTheBlankInputComponent implements ControlValueAccessor {
  @Input() label: string = '';

  constructor() { }

  value: FillInBlankTextEditorOutput = {text: '', answers: []};

  private onChange: (value: FillInTheBlankQuestionFormValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: FillInTheBlankQuestionFormValue): void {
    this.value = {
      text: obj.text,
      answers: [obj.answer]
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  onInput(value: FillInBlankTextEditorOutput) {
    this.onChange({
      text: value.text,
      answer: value.answers.length > 0 ? value.answers[0] : ''
    });
  }
}
