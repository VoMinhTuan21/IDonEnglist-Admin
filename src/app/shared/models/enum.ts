export enum PageLayout {
  Authorized = 'authorized',
  UnAuthorized = 'unauthorized',
  Error = 'error',
  Loading = "loading"
}

export enum Skill {
  Listening = 1,
  Reading = 5,
  Writing = 10,
  Speaking = 15
}

export enum CreateTestStep {
  CreateTest = 1,
  ChooseTestPart = 3,
  CreateSections = 6,
}

export enum EMatchingQuestionType {
  Heading = 1,
  Information = 4
}

export enum EBinaryResponseQuestionType {
  TrueFalseNotGiven = 1,
  YesNoNotGiven = 2
}

export enum EToolList {
  Direction = 1,
  Passage = 2,
  QuestionWithChoices = 3,
  FillInTheBlank = 4,
  ClozeTest = 5,
  MatchingQuestion = 6,
  BinaryResponseQuestion = 7,
  Image = 8
}