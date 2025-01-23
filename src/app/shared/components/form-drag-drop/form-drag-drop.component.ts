import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { DroppableDirective } from '@core/directives/droppable.directive';
import { ToolLabelPipe } from '@core/pipes/tool-label.pipe';
import { requiredAllFields } from '@core/validators/required-group-question-validator';
import {
  DragItem,
  FormControlItem,
  GroupQuestionsForm,
  GroupQuestionsFormValue,
  GroupQuestionsMapping,
} from '@shared/models/common';
import { ToolList } from '@shared/models/constants';
import { EToolList } from '@shared/models/enum';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { QuillEditorComponent } from "../quill-editor/quill-editor.component";
import { BinaryResponseQuestionComponent } from './binary-response-question/binary-response-question.component';
import { ClozeTestInputComponent } from './cloze-test-input/cloze-test-input.component';
import { FillInTheBlankInputComponent } from './fill-in-the-blank-input/fill-in-the-blank-input.component';
import { MatchingQuestionComponent } from './matching-question/matching-question.component';
import { QuestionWithChoicesInputComponent } from './question-with-choices-input/question-with-choices-input.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
@Component({
  selector: 'app-form-drag-drop',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    DroppableDirective,
    ToolLabelPipe,
    QuestionWithChoicesInputComponent,
    FillInTheBlankInputComponent,
    ClozeTestInputComponent,
    MatchingQuestionComponent,
    BinaryResponseQuestionComponent,
    UploadImageComponent,
    NzButtonModule,
    NzIconModule,
    NzPopconfirmModule,
    CommonModule,
    QuillEditorComponent
],
  templateUrl: './form-drag-drop.component.html',
  styleUrl: './form-drag-drop.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDragDropComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormDragDropComponent),
      multi: true,
    },
  ],
})
export class FormDragDropComponent
  implements ControlValueAccessor, OnInit, Validator, OnDestroy
{
  @Input() disableDragDrop: boolean = false;
  @Input() acceptedToolList?: DragItem[] = [];
  @Input() excludeToolList?: DragItem[] = [];

  @ViewChild(BinaryResponseQuestionComponent) binaryResponseQuestionComponent!: BinaryResponseQuestionComponent;
  @ViewChild(MatchingQuestionComponent) matchingQuestionComponent!: MatchingQuestionComponent;

  $hasErrors = new Subject<boolean>();
  $touched = new Subject<boolean>();
  $unsubscribe = new Subject<void>();

  private isUpdatingValidity = false;
  eToolList = EToolList;
  excludeItemsToolForGroupQuestions = ToolList.filter((item) =>
    [EToolList.Passage].includes(item.id)
  );
  formGroup!: GroupQuestionsForm;
  formGroupControls: FormControlItem[] = [];
  control: AbstractControl | null = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.formGroup = new FormGroup({});
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
    this.control = control;
    if (!this.isUpdatingValidity) {
      this.isUpdatingValidity = true;
      this.$hasErrors.next(control.errors ? true : false);
      this.$touched.next(control.touched);
      this.isUpdatingValidity = false;
    }

    if (this.formGroup.invalid) {
      return { required: true };
    }

    if (Utils.isObjectHasEmptyField(this.formGroup.value)) {
      return { required: true };
    }

    return null;
  }

  writeValue(value: GroupQuestionsFormValue): void {
    Object.keys(this.formGroup.controls).forEach(key => this.formGroup.removeControl(key));
    this.formGroupControls = [];

    for (const key of Object.keys(value)) {
      switch (key) {
        case 'instruction':
        case 'passage':
        case 'image':
        case 'clozeQuestions':
        case 'matchingQuestions':
        case 'binaryResponseQuestions':
          this.formGroup.addControl(
            key,
            new FormControl(value[key], [requiredAllFields()])
          );
          if (
            !this.formGroupControls.find((item) => item.controlInstance === key)
          ) {
            this.formGroupControls.push({
              id: uuidv4(),
              controlType: GroupQuestionsMapping[key],
              controlInstance: key,
            });
          }
          break;
        case 'choicesQuestions':
        case 'fillInBlankQuestions':
          if (value[key]?.length) {
            this.formGroup.addControl(
              key,
              new FormArray(
                value[key]?.map(
                  (item) => new FormControl(item, [requiredAllFields()])
                ) ?? []
              )
            );
            this.formGroupControls.push({
              id: uuidv4(),
              controlType: GroupQuestionsMapping[key],
              controlInstance: key,
              items: value[key]?.map((item) => ({ id: uuidv4() })) ?? [],
            });
          }
          break;
        default:
          break;
      }
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
    this.formGroup.valueChanges
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((value) => {
        this.onChange(value);
      });
  }

  handleItemDropped(event: DragItem) {
    const existedFormControl = this.formGroupControls.find(
      (item) => item.controlType === event.id
    );

    if (
      existedFormControl &&
      (existedFormControl.controlType === EToolList.Direction ||
      existedFormControl.controlType === EToolList.Passage ||
      existedFormControl.controlType === EToolList.Image ||
      existedFormControl.controlType === EToolList.ClozeTest)
    ) {
      return;
    }

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
          new FormControl(null, [requiredAllFields()])
        );
        break;
      case EToolList.QuestionWithChoices:
        this.addQuestion(event, 'choicesQuestions');
        break;
      case EToolList.FillInTheBlank:
        this.addQuestion(event, 'fillInBlankQuestions');
        break;
      case EToolList.ClozeTest:
        this.formGroupControls.push({
          id: uuidv4(),
          controlType: EToolList.ClozeTest,
          controlInstance: 'clozeQuestions',
        });
        this.formGroup.addControl(
          'clozeQuestions',
          new FormControl(
            {
              text: '<table style="width: 100%; border-collapse: collapse;"><tr><td contenteditable="true" style="border: 1px solid black; padding: 5px; height: 32px;">Test</td><td contenteditable="true" style="border: 1px solid black; padding: 5px; height: 32px;">Test</td></tr><tr><td contenteditable="true" style="border: 1px solid black; padding: 5px; height: 32px;">center the __BLANK__  or insertion point</td><td contenteditable="true" style="border: 1px solid black; padding: 5px; height: 32px;">__BLANK__  the selection or insertion point</td></tr></table><br>',
              answers: ['selection', 'justifies'],
            },
            [requiredAllFields()]
          )
        );
        break;
      case EToolList.MatchingQuestion:
        if (existedFormControl) {
          this.matchingQuestionComponent?.handleAddQuestion();
          break;
        }

        this.formGroupControls.push({
          id: uuidv4(),
          controlType: EToolList.MatchingQuestion,
          controlInstance: 'matchingQuestions',
        });
        this.formGroup.addControl(
          'matchingQuestions',
          new FormControl(
            {
              options: [{ id: '2', text: '' }],
              type: 0,
              questions: [
                {
                  text: '',
                  answer: '',
                },
              ],
            },
            [requiredAllFields()]
          )
        );
        break;
      case EToolList.BinaryResponseQuestion:
        if (existedFormControl) {
          console.log("this.binaryResponseQuestionComponent: ", this.binaryResponseQuestionComponent);
          this.binaryResponseQuestionComponent?.handleAddQuestion();
          break;
        }
        
        this.formGroupControls.push({
          id: uuidv4(),
          controlType: EToolList.BinaryResponseQuestion,
          controlInstance: 'binaryResponseQuestions',
        });
        this.formGroup.addControl(
          'binaryResponseQuestions',
          new FormControl(
            {
              type: 0,
              questions: [
                {
                  text: '',
                  answer: '',
                },
              ],
            },
            [requiredAllFields()]
          )
        );
        break;
      case EToolList.Image:
        this.formGroupControls.push({
          id: uuidv4(),
          controlType: EToolList.Image,
          controlInstance: 'image',
        });
        this.formGroup.addControl(
          'image',
          new FormControl(
            {
              publicId: uuidv4(),
              url: 'https://i.pinimg.com/736x/0f/f9/b1/0ff9b16e504071ac52053ae2a08b3ae6.jpg',
            },
            [Validators.required]
          )
        );
        break;
      default:
        break;
    }
  }

  addQuestion(question: DragItem, controlInstance: string) {
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
        controlInstance,
        items: [newQuestion],
      });
    }

    let questionsControl = this.formGroup.get(controlInstance) as FormArray;
    if (!questionsControl) {
      this.formGroup.addControl(controlInstance, new FormArray([]));
      questionsControl = this.formGroup.get(controlInstance) as FormArray;
    }

    switch (question.id) {
      case EToolList.QuestionWithChoices:
        questionsControl.push(
          new FormControl(
            {
              text: 'Which is the National Date of Vietnam?',
              choices: [
                {
                  text: '2/9/1945',
                  markAsAnswer: true,
                },
                {
                  text: '30/4/1975',
                  markAsAnswer: false,
                },
              ],
            },
            [requiredAllFields()]
          )
        );
        break;
      case EToolList.FillInTheBlank:
        questionsControl.push(
          new FormControl(
            {
              text: 'Teeth is made of __BLANK__',
              answer: 'calcium',
            },
            [requiredAllFields()]
          )
        );
        break;
      default:
        break;
    }
  }

  removeControl(control: string) {
    this.formGroupControls = this.formGroupControls.filter(
      (item) => item.controlInstance !== control
    );
    this.formGroup.removeControl(control);
  }

  removeQuestion(controlInstance: string, index: number) {
    this.formGroupControls
      .find((item) => item.controlInstance === controlInstance)
      ?.items?.splice(index, 1);
    (this.formGroup.get(controlInstance) as FormArray)?.removeAt(index);
  }

  get isInvalid(): boolean {
    return this.control
      ? this.control.invalid && (this.control.dirty || this.control.touched)
      : false;
  }
}
