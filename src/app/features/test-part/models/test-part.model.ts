export type TestPart = {
  id: number;
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