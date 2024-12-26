import { Component, forwardRef } from '@angular/core';
import { FillInBlankTextEditorComponent } from "../fill-in-blank-text-editor/fill-in-blank-text-editor.component";
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { ClozeTestQuestionFormValue, FillInBlankTextEditorOutput } from '@shared/models/common';
import { Utils } from '@shared/utils/utils';

@Component({
  selector: 'app-cloze-test-input',
  standalone: true,
  imports: [FillInBlankTextEditorComponent, FormsModule],
  templateUrl: './cloze-test-input.component.html',
  styleUrl: './cloze-test-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClozeTestInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ClozeTestInputComponent),
      multi: true
    }
  ]
})
export class ClozeTestInputComponent implements ControlValueAccessor, Validator {
  value: FillInBlankTextEditorOutput = { text: '', answers: [] };
  shouldValidate = 0;

  private onChange: (value: ClozeTestQuestionFormValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: ClozeTestQuestionFormValue): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(value: FillInBlankTextEditorOutput) {
    this.value = value;
    this.onChange({
      text: value.text,
      answers: value.answers
    })
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
