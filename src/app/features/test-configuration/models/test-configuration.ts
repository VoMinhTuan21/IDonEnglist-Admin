import { Category } from "@features/category/models/category.model";

export interface ITestTypeTableItem {
  id: number;
  name: string;
  code: string;
  categorySkill: {
    id: number;
    skill: number;
    category: {
      id: number;
      name: string;
      code: string;
    }
  },
  questions: number;
  duration: number;
  parts: number;
}

export interface CreateTestTypeRequest {
  name: string;
  duration: number;
  questions: number;
  categorySkillId: number;
  parts: CreateTestPartRequest[];
}

export interface UpdateTestTypeRequest extends CreateTestTypeRequest {
  id: number;
  parts: UpdateTestPartRequest[]
}

export interface CreateTestPartRequest {
  name: string;
  questions: number;
  duration: number;
  order: number;
}

export interface UpdateTestPartRequest extends CreateTestPartRequest {
  id: string;
}

export interface ITestPartDetail {
  id: number;
  name: string;
  code: string;
  questions: number;
  testTypeId: number;
  order: number;
  duration: number;
}

export type TestTypeDetail = Omit<ITestTypeTableItem, "parts"> & {
  parts: ITestPartDetail[]
}