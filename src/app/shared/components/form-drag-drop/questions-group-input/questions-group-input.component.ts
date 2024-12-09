import { Component, forwardRef, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DragItem,
  FormControlItem,
  GroupQuestionsForm,
} from '@shared/models/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TextEditorInputComponent } from '../text-editor-input/text-editor-input.component';
import { DroppableDirective } from '@core/directives/droppable.directive';
import { EToolList, ToolList } from '@shared/models/constants';
import { ToolLabelPipe } from '@core/pipes/tool-label.pipe';
import { v4 as uuidv4 } from 'uuid';
import { Validators as EditorValidator } from 'ngx-editor';
import { QuestionWithChoicesInputComponent } from '../question-with-choices-input/question-with-choices-input.component';
import { FillInTheBlankInputComponent } from '../fill-in-the-blank-input/fill-in-the-blank-input.component';
import { ClozeTestInputComponent } from '../cloze-test-input/cloze-test-input.component';

@Component({
  selector: 'app-questions-group-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    TextEditorInputComponent,
    DroppableDirective,
    ToolLabelPipe,
    QuestionWithChoicesInputComponent,
    TextEditorInputComponent,
    FillInTheBlankInputComponent,
    ClozeTestInputComponent,
  ],
  templateUrl: './questions-group-input.component.html',
  styleUrl: './questions-group-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuestionsGroupInputComponent),
      multi: true,
    },
  ],
})
export class QuestionsGroupInputComponent
  implements ControlValueAccessor, OnInit
{
  eToolList = EToolList;
  excludeItemsToolForGroupQuestions = ToolList.filter((item) =>
    [EToolList.Passage].includes(item.id)
  );
  formGroup!: GroupQuestionsForm;
  formGroupControls: FormControlItem[] = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.formGroup = new FormGroup({});
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

  ngOnInit(): void {
    this.initializeForm();
  }

  handleItemDropped(event: DragItem) {
    switch (event.id) {
      case EToolList.Direction:
        this.formGroupControls.push({
          id: uuidv4(),
          controlType: EToolList.Direction,
          controlInstance: 'instruction',
        });
        this.formGroup.addControl(
          'instruction',
          new FormControl(null, [Validators.required])
        );
        break;
      case EToolList.Passage:
        this.formGroupControls.push({
          id: uuidv4(),
          controlType: EToolList.Passage,
          controlInstance: 'passage',
        });
        this.formGroup.addControl(
          'passage',
          new FormControl(null, [EditorValidator.required()])
        );
        break;
      case EToolList.QuestionWithChoices:
      case EToolList.FillInTheBlank:
        this.addQuestion(event)
        break;
      case EToolList.ClozeTest:
        this.formGroupControls.push({
          id: uuidv4(),
          controlType: EToolList.ClozeTest,
          controlInstance: 'clozeQuestions'
        });
        this.formGroup.addControl("clozeQuestions", new FormControl({
          text: "Dog is a pet __BLANK__ .<div>It is the oldest friend of human __BLANK__ .</div>",
          answers: ["animal", "being"]
      }))
        break;
      default:
        break;
    }
  }

  addQuestion(question: DragItem) {
    const existed = this.formGroupControls.find(
      (ctr) => ctr.controlType === question.id
    );

    const newQuestion: FormControlItem = {
      id: uuidv4(),
    };

    if (existed) {
      if (existed.items) {
        existed.items.push(newQuestion);
      } else {
        existed.items = [newQuestion];
      }
    } else {
      this.formGroupControls.push({
        id: uuidv4(),
        controlType: question.id,
        controlInstance: 'questions',
        items: [newQuestion],
      });
    }

    let questionsControl = this.formGroup.get('questions') as FormArray;
    if (!questionsControl) {
      this.formGroup.addControl("questions", new FormArray([]));
      questionsControl = this.formGroup.get('questions') as FormArray;
    }

    switch (question.id) {
      case EToolList.QuestionWithChoices:
        questionsControl.push(
          new FormControl({
            text: '',
            choices: [
              {
                text: '',
                markAsAnswer: false,
              },
            ],
          })
        );
        break;
      case EToolList.FillInTheBlank:
        questionsControl.push(
          new FormControl({
            text: 'I love __BLANK__ .',
            answer: 'cooking'
          })
        )
        break;
      default:
        break;
    }
  }
}
