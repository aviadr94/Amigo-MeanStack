import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'cityFilter'
})
export class SearchCityPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }

    return value.filter((val) => {
      const rVal = (val.city.toLocaleLowerCase().includes(args));
      return rVal;
    });

  }
}
