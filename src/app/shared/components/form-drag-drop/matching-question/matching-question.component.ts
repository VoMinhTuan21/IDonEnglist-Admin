import { NgStyle } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NumberToCharPipe } from '@core/pipes/number-to-char.pipe';
import { RomanNumeralPipe } from '@core/pipes/number-to-roman-numeral.pipe';
import {
  FormControlItem,
  MatchingQuestionForm,
  MatchingQuestionFormValue,
} from '@shared/models/common';
import { EMatchingQuestionType } from '@shared/models/enum';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { v4 as uuidv4 } from 'uuid';

interface Panel {
  active: boolean;
  disabled: boolean;
  name: string;
}

@Component({
  selector: 'app-matching-question',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzIconModule,
    RomanNumeralPipe,
    NzCollapseModule,
    NgStyle,
    NzFlexModule,
    NzToolTipModule,
    NumberToCharPipe,
    NzPopconfirmModule,
  ],
  templateUrl: './matching-question.component.html',
  styleUrl: './matching-question.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatchingQuestionComponent),
      multi: true,
    },
  ],
})
export class MatchingQuestionComponent implements ControlValueAccessor, OnInit {
  type: EMatchingQuestionType = EMatchingQuestionType.Heading;
  eMatchingQuestionType = EMatchingQuestionType;

  formGroup!: MatchingQuestionForm;

  formGroupControls: FormControlItem[] = [
    {
      id: uuidv4(),
      controlInstance: 'type',
    },
    {
      id: uuidv4(),
      controlInstance: 'options',
      items: [
        {
          id: uuidv4(),
          items: [
            {
              id: uuidv4(),
              controlInstance: 'id',
            },
            {
              id: uuidv4(),
              controlInstance: 'text',
            },
          ],
        },
      ],
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

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  matchingSelectionList: {
    value: string;
    label: string;
  }[] = [];

  questionTypes: { value: number; label: string }[] = [];

  readonly panels: Panel[] = [
    {
      active: true,
      disabled: false,
      name: 'Options',
    },
    {
      active: false,
      disabled: true,
      name: 'Questions',
    },
  ];

  constructor() {
    this.questionTypes = Utils.getQuestionTypes(EMatchingQuestionType);

    this.formGroup = new FormGroup({
      options: new FormArray([
        new FormGroup({
          id: new FormControl(uuidv4()),
          text: new FormControl(''),
        }),
      ]),
      questions: new FormArray([
        new FormGroup({
          text: new FormControl(''),
          answer: new FormControl(''),
        }),
      ]),
      type: new FormControl(EMatchingQuestionType.Heading),
    }) as FormGroup;

    this.formGroup
      .get('type')
      ?.valueChanges.subscribe((value) => (this.type = value));
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  writeValue(value: MatchingQuestionFormValue): void {
    if (!value) return;

    const createFormGroup = (fields: { [key: string]: string }[]) => {
      return fields.map(
        (field) =>
          new FormGroup({
            ...Object.fromEntries(
              Object.entries(field).map(([key]) => [key, new FormControl('')])
            ),
          })
      );
    };

    const createControlsArray = (length: number, controlNames: string[]) => {
      return Array.from({ length }, () => ({
        id: uuidv4(),
        items: controlNames.map((control) => ({
          id: uuidv4(),
          controlInstance: control,
        })),
      }));
    };

    const optionsArray = new FormArray(
      createFormGroup(value.options.map(() => ({ text: '', id: '' })))
    );
    const optionControlsArray = createControlsArray(value.options.length, [
      'id',
      'text',
    ]);

    const questionsArray = new FormArray(
      createFormGroup(value.questions.map(() => ({ answer: '', text: '' })))
    );
    const questionControlsArray = createControlsArray(value.questions.length, [
      'text',
      'answer',
    ]);

    this.formGroup.setControl('options', optionsArray as FormArray);
    this.formGroup.setControl('questions', questionsArray as FormArray);

    this.formGroupControls[1].items = optionControlsArray;
    this.formGroupControls[2].items = questionControlsArray;

    this.formGroup.setValue(value, { emitEvent: false });

    this.matchingSelectionList = value.options
      .filter((e) => e.text)
      .map((e) => ({
        label: e.text,
        value: e.id,
      }));

    this.type = value.type;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  private initializeForm(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      this.onChange(value);

      if (value.options) {
        this.matchingSelectionList = value.options
          .filter((item) => item.text)
          .map((item) => ({ value: item.id ?? '', label: item.text ?? '' }));
      }
    });
  }

  handleAddOption() {
    this.formGroupControls[1].items?.push({
      id: uuidv4(),
      items: [
        {
          id: uuidv4(),
          controlInstance: 'id',
        },
        {
          id: uuidv4(),
          controlInstance: 'text',
        },
      ],
    });

    (this.formGroup.get('options') as FormArray)?.push(
      new FormGroup({
        id: new FormControl(uuidv4()),
        text: new FormControl(''),
      })
    );
  }

  handleRemoveOption(index: number) {
    this.formGroupControls[1].items?.splice(index, 1);

    const optionListControl = this.formGroup.get('options') as FormArray;
    if (optionListControl) {
      const removedOption = optionListControl.at(index) as FormGroup<{
        id: FormControl<string>;
        text: FormControl<string>;
      }>;

      if (removedOption) {
        const optionId = removedOption.get('id')?.value ?? '';
        (this.formGroup.get('questions') as FormArray).controls.forEach(
          (control) => {
            const questionOption = control.get('answer')?.value ?? '';
            if (questionOption && optionId && questionOption === optionId) {
              control.patchValue({
                answer: '',
              });
            }
          }
        );
      }
    }

    optionListControl?.removeAt(index);
  }

  handleAddQuestion() {
    this.formGroupControls[2].items?.push({
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
    });

    (this.formGroup.get('questions') as FormArray)?.push(
      new FormGroup({
        text: new FormControl(''),
        answer: new FormControl(''),
      })
    );
  }

  handleRemoveQuestion(index: number) {
    this.formGroupControls[2].items?.splice(index, 1);

    (this.formGroup.get('questions') as FormArray)?.removeAt(index);
  }

  readonly customStyle = {
    background: '#f7f7f7',
    'border-radius': '4px',
    border: '0px',
  };
}
