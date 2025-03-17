import { HttpStatusCode } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DragItem } from './common';
import { EBinaryResponseQuestionType, EToolList, Skill } from './enum';

export const TOKEN = 'i-don-englist-token';
export const REFRESH_TOKEN = 'i-don-englist-refresh-token';
export const REMEMBER_ME = 'remember-me';

export const SkillColor: { [index: number]: string } = {
  [Skill.Listening]: 'cyan',
  [Skill.Reading]: 'yellow',
  [Skill.Writing]: 'blue',
  [Skill.Speaking]: 'green',
};

export const UploadImageUrl = `${environment.baseUrl}/api/file/image`;
export const UploadAudioUrl = `${environment.baseUrl}/api/file/audio`;

export const ToolList: DragItem[] = [
  {
    id: EToolList.Direction,
    name: 'Direction',
    description: 'Instruction for the section, group questions',
  },
  {
    id: EToolList.Passage,
    name: 'Passage',
    description: 'Passage for the section, group questions',
  },
  {
    id: EToolList.QuestionWithChoices,
    name: 'Choices Question',
    description: 'Question with multiple choices, one or more answers',
  },
  {
    id: EToolList.FillInTheBlank,
    name: 'Fill in Blank',
    description: 'Fill in the blank question, only one blank',
  },
  {
    id: EToolList.ClozeTest,
    name: 'Cloze Test',
    description: 'Multiple blanks in a small paragraph',
  },
  {
    id: EToolList.MatchingQuestion,
    name: 'Matching Question',
    description: 'Matching questions',
  },
  {
    id: EToolList.BinaryResponseQuestion,
    name: 'Binary Question',
    description: 'True/False/Not Given or Yes/No/Not Given',
  },
  {
    id: EToolList.Image,
    name: 'Image',
    description: 'Image for the section, group questions',
  },
];

export const TrueFalseNotGivenSelect = [
  {
    label: 'True',
    value: 'true',
  },
  {
    label: 'False',
    value: 'false',
  },
  {
    label: 'Not given',
    value: 'not given',
  },
];

export const YesNoNotGivenSelect = [
  {
    label: 'Yes',
    value: 'yes',
  },
  {
    label: 'No',
    value: 'no',
  },
  {
    label: 'Not given',
    value: 'not given',
  },
];

export const BinaryResponseQuestionTypeLabel: { [index: number]: string} = {
  [EBinaryResponseQuestionType.TrueFalseNotGiven]: "True/False/Not Given",
  [EBinaryResponseQuestionType.YesNoNotGiven]: "Yes/No/Not Given"
};

export const BLANK = '__BLANK__'
export const BlankRegex = /__BLANK__/g;

export const ExcludeErrorAPI = [
  {
    url: '/api/test-type/detail',
    status: HttpStatusCode.NotFound
  }
]