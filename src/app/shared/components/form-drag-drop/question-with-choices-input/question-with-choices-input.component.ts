import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
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
  Validators
} from '@angular/forms';
import { NumberToCharPipe } from '@core/pipes/number-to-char.pipe';
import {
  FormControlItem,
  QuestionWithChoicesForm,
  QuestionWithChoicesFormValue,
} from '@shared/models/common';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-question-with-choices-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NumberToCharPipe,
    NzInputModule,
    NzFlexModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzFlexModule,
    NzToolTipModule,
    NzDropDownModule,
    NzPopconfirmModule,
  ],
  templateUrl: './question-with-choices-input.component.html',
  styleUrl: './question-with-choices-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuestionWithChoicesInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => QuestionWithChoicesInputComponent),
      multi: true,
    },
  ],
})
export class QuestionWithChoicesInputComponent
  implements ControlValueAccessor, OnInit, Validator, OnDestroy
{
  private isUpdatingValidity = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  @Input() label: string = '';

  @Output() removeControl = new EventEmitter();

  $hasErrors = new Subject<boolean>();
  $touched = new Subject<boolean>();
  $unsubscribe = new Subject<void>();

  formGroup!: QuestionWithChoicesForm;

  formGroupControls: FormControlItem[] = [
    {
      id: uuidv4(),
      controlInstance: 'text',
    },
    {
      id: uuidv4(),
      controlInstance: 'choices',
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
              controlInstance: 'markAsAnswer',
            },
          ],
        },
      ],
    },
  ];

  constructor() {
    this.formGroup = new FormGroup({
      text: new FormControl('', [Validators.required]),
      choices: new FormArray([
        new FormGroup({
          text: new FormControl<string>('', [Validators.required]),
          markAsAnswer: new FormControl<boolean>(false),
        }),
      ]),
    }) as QuestionWithChoicesForm;
  }

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
      return { hasError: true };
    }

    return null;
  }

  writeValue(value: QuestionWithChoicesFormValue): void {
    if (!value) {
      return;
    }

    this.formGroup.setControl('text', new FormControl<string>(value.text, [Validators.required]) as FormControl);
    this.formGroup.setControl(
      'choices',
      new FormArray(
        value.choices.map(
          (choice) =>
            new FormGroup({
              text: new FormControl<string>(choice.text, [Validators.required]),
              markAsAnswer: new FormControl<boolean>(choice.markAsAnswer),
            })
        )
      ) as FormArray
    );

    this.formGroupControls = [
      {
        id: uuidv4(),
        controlInstance: 'text',
      },
      {
        id: uuidv4(),
        controlInstance: 'choices',
        items: value.choices.map(() => ({
          id: uuidv4(),
          items: [
            {
              id: uuidv4(),
              controlInstance: 'text',
            },
            {
              id: uuidv4(),
              controlInstance: 'markAsAnswer',
            },
          ],
        })),
      },
    ];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  private initializeForm(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      console.log("value: ", value);
      this.onChange(value);
    });
  }

  handleAddOption() {
    this.formGroupControls[1].items?.push({
      id: uuidv4(),
      items: [
        {
          id: uuidv4(),
          controlInstance: 'text',
        },
        {
          id: uuidv4(),
          controlInstance: 'markAsAnser',
        },
      ],
    });

    (this.formGroup.get('choices') as FormArray).push(
      new FormGroup({
        text: new FormControl<string>('', [Validators.required]),
        markAsAnswer: new FormControl<boolean>(false),
      })
    );
  }

  handleRemoveOption(optionIndex: number) {
    this.formGroupControls[1].items?.splice(optionIndex, 1);
    (this.formGroup.get('choices') as FormArray).removeAt(optionIndex);
  }

  confirmDeleteQuestion() {
    this.removeControl.emit();
  }
}
