import { Pipe, PipeTransform } from '@angular/core';
import { EToolList } from '@shared/models/enum';

@Pipe({
  name: 'toolLabel',
  standalone: true,
})
export class ToolLabelPipe implements PipeTransform {
  transform(type?: EToolList) {
    switch (type) {
      case EToolList.Passage:
        return 'Passage';
      case EToolList.Direction:
        return 'Direction';
      case EToolList.ClozeTest:
        return 'Cloze Question';
      case EToolList.MatchingQuestion:
        return 'Matching Question'
      default:
        return '';
    }
  }
}
