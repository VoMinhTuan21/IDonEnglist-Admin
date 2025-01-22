import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { requiredAllFields } from '@core/validators/required-group-question-validator';
import { ClozeTestQuestionFormValue } from '@shared/models/common';
import { Utils } from '@shared/utils/utils';
import { NzFormModule } from 'ng-zorro-antd/form';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { QuillEditorComponent } from '../../quill-editor/quill-editor.component';

@Component({
  selector: 'app-cloze-test-input',
  standalone: true,
  imports: [
    FormsModule,
    QuillEditorComponent,
    ReactiveFormsModule,
    NzFormModule,
  ],
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
      multi: true,
    },
  ],
})
export class ClozeTestInputComponent
  implements ControlValueAccessor, Validator, OnInit, OnDestroy
{
  private isUpdatingValidity = false;
  private onChange: (value: ClozeTestQuestionFormValue) => void = () => {};
  private onTouched: () => void = () => {};

  $hasErrors = new Subject<boolean>();
  $touched = new Subject<boolean>();
  $unsubscribe = new Subject<void>();
  formGroup!: FormGroup<{
    clozeTest: FormControl<ClozeTestQuestionFormValue>;
  }>;

  constructor() {
    this.formGroup = new FormGroup({
      clozeTest: new FormControl(
        {
          text: '',
          answers: [],
        },
        [requiredAllFields()]
      ),
    }) as FormGroup;

    this.formGroup.valueChanges
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((value) => {
        this.onChange({
          text: value.clozeTest?.text || '',
          answers: value.clozeTest?.answers || [],
        });
      });
  }

  ngOnInit(): void {
    combineLatest([
      this.$hasErrors.asObservable(),
      this.$touched.asObservable(),
    ])
      .pipe(
        filter(
          ([hasErrors, touched]) => hasErrors === true && touched === true
        ),
        takeUntil(this.$unsubscribe)
      )
      .subscribe(() => {
        Utils.markAllAsTouched(this.formGroup);
      });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  writeValue(obj: ClozeTestQuestionFormValue): void {
    this.formGroup.patchValue({
      clozeTest: {
        text: obj.text,
        answers: obj.answers,
      },
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.isUpdatingValidity) {
      this.isUpdatingValidity = true;
      this.$hasErrors.next(control.errors ? true : false);
      this.$touched.next(control.touched);
      this.isUpdatingValidity = false;
    }

    if (this.formGroup.invalid) {
      return { hasError: true };
    }

    return null;
  }
}
