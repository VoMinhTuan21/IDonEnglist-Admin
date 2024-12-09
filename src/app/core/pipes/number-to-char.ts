import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberToChar",
  standalone: true
})
export class NumberToCharPipe  implements PipeTransform {
  transform(value: number) {
    if (value < 0 || value > 25) {
      return ''; // Return empty string for out of range values
    }
    return String.fromCharCode(value + 65);
  }
}