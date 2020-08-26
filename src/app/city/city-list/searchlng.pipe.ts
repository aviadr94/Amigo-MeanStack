import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'lngFilter'
})
export class SearchLngPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }

    return value.filter((val) => {
      const rVal = (val.lng.toLocaleLowerCase().includes(args));
      return rVal;
    });

  }
}
