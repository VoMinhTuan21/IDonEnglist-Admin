import { environment } from '../../../environments/environment';
import { DragItem } from './common';
import { Skill } from './enum';

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

export enum EToolList {
  Direction = 1,
  Passage = 2,
  QuestionWithChoices = 3,
  FillInTheBlank = 4,
  ClozeTest = 5,
  MatchingQuestion = 6,
  TrueFalseNotGiven = 7,
  Image = 8
}

export const ToolList: DragItem[] = [
  {
    id: EToolList.Direction,
    name: "Direction"
  },
  {
    id: EToolList.Passage,
    name: "Passage"
  },
  {
    id: EToolList.QuestionWithChoices,
    name: "Question with choices"
  },
  {
    id: EToolList.FillInTheBlank,
    name: "Fill-in-the-Blank (Sentence level)"
  },
  {
    id: EToolList.ClozeTest,
    name: "Cloze Test (Paragraph level)"
  },
  {
    id: EToolList.MatchingQuestion,
    name: "Matching Question"
  },
  {
    id: EToolList.TrueFalseNotGiven,
    name: "True/False/Not Given"
  },
  {
    id: EToolList.Image,
    name: "Image"
  }
];