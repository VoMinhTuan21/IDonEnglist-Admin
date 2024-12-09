import { Component, forwardRef } from '@angular/core';
import { FillInBlankTextEditorComponent } from "../fill-in-blank-text-editor/fill-in-blank-text-editor.component";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClozeTestQuestionFormValue, FillInBlankTextEditorOutput } from '@shared/models/common';

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
    }
  ]
})
export class ClozeTestInputComponent implements ControlValueAccessor {
  value: FillInBlankTextEditorOutput = { text: '', answers: [] };

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
    this.onChange({
      text: value.text,
      answers: value.answers
    })
  }
}
