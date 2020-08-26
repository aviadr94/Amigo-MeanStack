import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'latFilter'
})
export class SearchLatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }

    return value.filter((val) => {
      const rVal = (val.lat.toLocaleLowerCase().includes(args));
      return rVal;
    });

  }
}
