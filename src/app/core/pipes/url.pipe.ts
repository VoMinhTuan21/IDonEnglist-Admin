import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "urlCode",
  standalone: true
})
export class UrlCodePipe implements PipeTransform {
  transform(code: string, id: number): string  {
      return `${code}-${id}`;
  }
}