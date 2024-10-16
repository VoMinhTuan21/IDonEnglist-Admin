import { Skill } from "./enum";

export const TOKEN = 'i-don-englist-token';
export const REFRESH_TOKEN = "i-don-englist-refresh-token";
export const REMEMBER_ME = "remember-me";

export const SkillColor: {[index: number]: string} = {
  [Skill.Listening]: "cyan",
  [Skill.Reading]: "yellow",
  [Skill.Writing]: "blue",
  [Skill.Speaking]: "green"
}