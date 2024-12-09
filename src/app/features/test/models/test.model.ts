import { FileModel } from "@shared/models/common";

export type CreateTestRequest = {
  name: string;
  categorySkillId: number;
  finalTestId: number;
  audio?: FileModel;
}

export type TestMinViewModel = {
  name: string;
  code: string;
  testTypeId: number;
  finalTestId: number;
}