import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { EBinaryResponseQuestionType, EMatchingQuestionType, EToolList } from './enum';

export interface Token {
  token: string;
  refreshToken: string;
}

export interface Breadcrumb {
  label: string;
  url: string;
}

export type SubmitStatus = 'idle' | 'pending' | 'success' | 'error';

export interface PaginationRequest {
  [key: string]: any;
  sortBy?: string;
  ascending?: boolean;
  withDeleted?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedList<T> {
  items: Array<T>;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FileModel {
  publicId: string;
  url: string;
}

export interface DragItem {
  id: number;
  name: string;
}

export interface FormControlItem {
  id?: string;
  controlType?: EToolList;
  controlInstance?: string;
  items?: FormControlItem[];
}

export type QuestionWithChoicesForm = FormGroup<{
  text: FormControl<string>;
  choices: FormArray<
    FormGroup<{
      text: FormControl<string>;
      markAsAnswer: FormControl<boolean>;
    }>
  >;
}>;

export type QuestionWithChoicesFormValue = {
  text: string;
  choices: [{
    text: string;
    markAsAnser: boolean;
  }]
}

export type GroupQuestionsForm = FormGroup<{
  instruction?: FormControl<string | null>;
  passage?: FormControl<string | null>;
  questions?: FormArray<FormControl<QuestionWithChoicesFormValue | FillInTheBlankQuestionFormValue>>
  clozeQuestions?: FormControl<ClozeTestQuestionFormValue>;
  matchingQuestions?: FormControl<MatchingQuestionFormValue>;
  binaryResponseQuestions?: FormControl<BinaryResponseQuestionFormValue>;
  image?: FormControl<ImageUploadFormValue>
}>

export type GroupQuestionsFormValue = {
  instruction?: string;
  passage?: string;
  questions: QuestionWithChoicesForm[]
}

export type FillInTheBlankQuestionFormValue = {
  text: string;
  answer: string;
}

export type FillInBlankTextEditorOutput = {
  text: string;
  answers: string[];
}

export type ClozeTestQuestionFormValue = FillInBlankTextEditorOutput;

export type MatchingQuestionForm = FormGroup<{
  options: FormArray<FormGroup<{
    id: FormControl<string>,
    text: FormControl<string>
  }>>,
  questions: FormArray<FormGroup<{
    text: FormControl<string>,
    answer: FormControl<string>
  }>>
  type: FormControl<EMatchingQuestionType>
}>

export type MatchingQuestionFormValue = {
  options: [{
    id: string;
    text: string;
  }],
  type: EMatchingQuestionType,
  questions: [{
    text: string;
    answer: string;
  }]
}

export type  BinaryResponseQuestionForm = FormGroup<{
  type: FormControl<EBinaryResponseQuestionType>,
  questions: FormArray<FormGroup<{
    text: FormControl<string>,
    answer: FormControl<string>
  }>>
}>

export type BinaryResponseQuestionFormValue = {
  type: EBinaryResponseQuestionType,
  questions: [{
    text: string,
    answer: string
  }]
}

export type ImageUploadFormValue = {
  publicId: string;
  url: string;
}