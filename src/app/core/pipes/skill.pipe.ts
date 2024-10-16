import { Pipe, PipeTransform } from '@angular/core';
import { SkillColor } from '@shared/models/constants';
import { Skill } from '@shared/models/enum';

@Pipe({
  name: 'skill',
  standalone: true
})
export class SkillPipe implements PipeTransform {

  transform(skillNumber: number = 0): { name: string, color: string} {
    const skillName = Skill[skillNumber] || "UnKnow skill";
    const skillColor = SkillColor[skillNumber] || "";

    return { name: skillName, color: skillColor }
  }

}
