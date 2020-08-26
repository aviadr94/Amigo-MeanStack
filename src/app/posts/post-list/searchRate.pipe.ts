import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'rateFilter'
})
export class SearchRatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }

    return value.filter((val) => {
      const rVal = (val.rating.toLocaleLowerCase().includes(args));
      return rVal;
    });

  }
}
