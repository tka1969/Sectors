import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'highlight'
})
export class DataHighlightPipe implements PipeTransform {

  transform(value: string, search: string): string {
    if (!search) {
      return value;
    }
    const regex = new RegExp(search, 'gi');
    return value.replace(regex, match => `<mark>${match}</mark>`);
  }  

}
