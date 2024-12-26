import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {
  BinaryResponseQuestionForm,
  BinaryResponseQuestionFormValue,
  FormControlItem,
} from '@shared/models/common';
import { BinaryResponseQuestionTypeLabel, TrueFalseNotGivenSelect, YesNoNotGivenSelect } from '@shared/models/constants';
import { EBinaryResponseQuestionType } from '@shared/models/enum';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { v4 as uuidv4 } from 'uuid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-binary-response-question',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzFlexModule,
    NzRadioModule,
    NzToolTipModule
  ],
  templateUrl: './binary-response-question.component.html',
  styleUrl: './binary-response-question.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BinaryResponseQuestionComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BinaryResponseQuestionComponent),
      multi: true,
    },
  ],
})
export class BinaryResponseQuestionComponent
  implements ControlValueAccessor, OnInit, Validator, OnDestroy
{
  private isUpdatingValidity = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  $hasErrors = new Subject<boolean>();
  $touched = new Subject<boolean>();
  $unsubscribe = new Subject<void>();

  eBinaryResponseQuestionType = EBinaryResponseQuestionType;

  trueFalseNotGivenSelect = TrueFalseNotGivenSelect;
  yesNoNotGivenSelect = YesNoNotGivenSelect;

  questionTypes: { value: number; label: string }[] = [];

  formGroup!: BinaryResponseQuestionForm;

  formGroupControls: FormControlItem[] = [
    {
      id: uuidv4(),
      controlInstance: 'type',
    },
    {
      id: uuidv4(),
      controlInstance: 'questions',
      items: [
        {
          id: uuidv4(),
          items: [
            {
              id: uuidv4(),
              controlInstance: 'text',
            },
            {
              id: uuidv4(),
              controlInstance: 'answer',
            },
          ],
        },
      ],
    },
  ];

  constructor() {
    this.questionTypes = Utils.getQuestionTypes(EBinaryResponseQuestionType).map(item => ({
      label: BinaryResponseQuestionTypeLabel[item.value],
      value: item.value
    }));

    this.formGroup = new FormGroup({
      type: new FormControl(EBinaryResponseQuestionType.TrueFalseNotGiven, [Validators.required, Validators.min(1)]),
      questions: new FormArray([
        new FormGroup({
          text: new FormControl('', [Validators.required]),
          answer: new FormControl('', [Validators.required]),
        }),
      ]),
    }) as FormGroup;
  }

  writeValue(value: BinaryResponseQuestionFormValue): void {
    if (!value) {
      return;
    }

    const questionsArray = new FormArray(Array.from({length: value.questions.length},  () => new FormGroup({
      text: new FormControl('', [Validators.required]),
          answer: new FormControl('', [Validators.required]),
    })));

    const questionControlsArray = Array.from({length: value.questions.length}, () => ({
      id: uuidv4(),
      items: [
        {
          id: uuidv4(),
          controlInstance: 'text',
        },
        {
          id: uuidv4(),
          controlInstance: 'answer',
        },
      ],
    }));

    this.formGroup.setControl('questions', questionsArray as FormArray);
    
    this.formGroupControls[1].items = questionControlsArray;

    this.formGroup.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  ngOnInit(): void {
    this.initializeForm();

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

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.isUpdatingValidity) {
      this.isUpdatingValidity = true;
      this.$hasErrors.next(control.errors ? true : false);
      this.$touched.next(control.touched);
      this.isUpdatingValidity = false;
    }

    if (this.formGroup.invalid) {
      return { hasError: true }
    }
    
    return null;
  }

  private initializeForm(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      this.onChange(value);
    });
  }

  handleAddQuestion() {
    this.formGroupControls[1].items?.push({
      id: uuidv4(),
      items: [
        {
          id: uuidv4(),
          controlInstance: 'text'
        },
        {
          id: uuidv4(),
          controlInstance: 'answer'
        }
      ]
    });

    (this.formGroup.get('questions') as FormArray)?.push(
      new FormGroup({
        text: new FormControl("", [Validators.required]),
        answer: new FormControl("", [Validators.required])
      })
    );
  }

  handleRemoveQuestion(index: number) {
    this.formGroupControls[1].items?.splice(index, 1);
    (this.formGroup.get("questions") as FormArray)?.removeAt(index);
  }
}
