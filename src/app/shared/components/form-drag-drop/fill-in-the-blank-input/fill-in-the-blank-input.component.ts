import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
import {
  FillInBlankTextEditorOutput,
  FillInTheBlankQuestionFormValue,
} from '@shared/models/common';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { QuillEditorComponent } from '../../quill-editor/quill-editor.component';

@Component({
  selector: 'app-fill-in-the-blank-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzFlexModule,
    NzPopconfirmModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule,
    QuillEditorComponent,
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
      multi: true,
    },
  ],
})
export class FillInTheBlankInputComponent
  implements ControlValueAccessor, Validator, OnDestroy, OnInit
{
  private isUpdatingValidity = false;

  @Input() label: string = '';
  @Output() removeControl = new EventEmitter();

  $hasErrors = new Subject<boolean>();
  $touched = new Subject<boolean>();
  $unsubscribe = new Subject<void>();

  formGroup!: FormGroup<{
    fillInTheBlank: FormControl<FillInBlankTextEditorOutput>;
  }>;

  private onChange: (value: FillInTheBlankQuestionFormValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.formGroup = new FormGroup({
      fillInTheBlank: new FormControl(
        {
          answers: [],
          text: '',
        },
        [requiredAllFields()]
      ),
    }) as FormGroup;

    this.formGroup.valueChanges
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((value) => {
        this.onChange({
          text: value.fillInTheBlank?.text || '',
          answer: value.fillInTheBlank?.answers[0] || '',
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

  writeValue(obj: FillInTheBlankQuestionFormValue): void {
    this.formGroup.patchValue({
      fillInTheBlank: {
        text: obj.text,
        answers: [obj.answer],
      },
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  confirmDeleteQuestion() {
    this.removeControl.emit();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log(
      "this.formGroup.get('fillInTheBlank')?.errors: ",
      this.formGroup.get('fillInTheBlank')?.errors
    );
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
