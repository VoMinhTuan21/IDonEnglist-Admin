export type TestPart = {
  id: string;
  name: string;
  code: string;
  duration: number;
  questions: number;
  testTypeId: number;
  order: number;
}

export type GetListTestPartsRequest = {
  testTypeId?: number;
}