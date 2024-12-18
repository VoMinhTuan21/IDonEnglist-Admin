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
  ],
})
export class BinaryResponseQuestionComponent
  implements ControlValueAccessor, OnInit
{
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

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
      type: new FormControl(EBinaryResponseQuestionType.TrueFalseNotGiven),
      questions: new FormArray([
        new FormGroup({
          text: new FormControl(''),
          answer: new FormControl(''),
        }),
      ]),
    }) as FormGroup;
  }

  writeValue(value: BinaryResponseQuestionFormValue): void {
    if (!value) {
      return;
    }

    const questionsArray = new FormArray(Array.from({length: value.questions.length},  () => new FormGroup({
      text: new FormControl(''),
          answer: new FormControl(''),
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
        text: new FormControl(""),
        answer: new FormControl("")
      })
    );
  }

  handleRemoveQuestion(index: number) {
    this.formGroupControls[1].items?.splice(index, 1);
    (this.formGroup.get("questions") as FormArray)?.removeAt(index);
  }
}
