import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NumberToCharPipe } from '@core/pipes/number-to-char.pipe';
import {
  FormControlItem,
  QuestionWithChoicesForm,
} from '@shared/models/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
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
    NzFlexModule
  ],
  templateUrl: './question-with-choices-input.component.html',
  styleUrl: './question-with-choices-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuestionWithChoicesInputComponent),
      multi: true,
    },
  ],
})
export class QuestionWithChoicesInputComponent
  implements ControlValueAccessor, OnInit
{
  @Input() label: string = '';
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
              controlInstance: 'markAsAnser',
            },
          ],
        },
      ],
    },
  ];
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {
    this.formGroup = new FormGroup({
      text: new FormControl('', [Validators.required]),
      choices: new FormArray([
        new FormGroup({
          text: new FormControl<string>(''),
          markAsAnswer: new FormControl(false),
        }),
      ]),
    }) as QuestionWithChoicesForm;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  writeValue(value: any): void {
    if (value) {
      this.formGroup.setValue(value, { emitEvent: false });
    }
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

    (this.formGroup.get("choices") as FormArray).push(new FormGroup({
      text: new FormControl<string>(''),
      markAsAnswer: new FormControl(false),
    }))
  }

  handleRemoveOption(optionIndex: number) {
    this.formGroupControls[1].items?.splice(optionIndex, 1);
    (this.formGroup.get("choices") as FormArray).removeAt(optionIndex);
  }
}
