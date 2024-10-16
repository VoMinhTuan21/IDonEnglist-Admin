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
  durations: number;
  parts: number;
}

export interface CreateTestTypeRequest {
  name: string;
  duration: number;
  questions: number;
  categorySkillId: number;
  parts: CreateTestPartRequest[];
}

export interface CreateTestPartRequest {
  name: string;
  questions: number;
  duration: number;
  order: number;
}