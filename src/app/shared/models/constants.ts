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
  },
  {
    id: EToolList.Passage,
    name: 'Passage',
  },
  {
    id: EToolList.QuestionWithChoices,
    name: 'Question with choices',
  },
  {
    id: EToolList.FillInTheBlank,
    name: 'Fill-in-the-Blank (Sentence level)',
  },
  {
    id: EToolList.ClozeTest,
    name: 'Cloze Test (Paragraph level)',
  },
  {
    id: EToolList.MatchingQuestion,
    name: 'Matching Question',
  },
  {
    id: EToolList.BinaryResponseQuestion,
    name: 'Binary Response Question',
  },
  {
    id: EToolList.Image,
    name: 'Image',
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