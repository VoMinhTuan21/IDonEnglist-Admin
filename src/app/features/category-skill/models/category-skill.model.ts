import { Skill } from "@shared/models/enum";

export type GetListCategorySkillRequest = {
  collectionId?: number;
  finalTestId?: number;
}

export type CategorySkillMin = {
  id: number;
  skill: Skill
}