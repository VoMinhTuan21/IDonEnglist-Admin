export interface Category {
  id: number;
  name: string;
  code: string;
  children?: Category[];
  skills?: Array<{
    id: number;
    skill: number;
  }>;
  parentId?: number;
}

export type CreateCategoryRequest = Pick<Category, "name" | "parentId"> & {skills?: number[]};
export type UpdateCategoryRequest = Pick<Category, "id" | "name" | "parentId"> & {skills?: number[]};
export type DeleteCategoryRequest = Pick<Category, "id">;