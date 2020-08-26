import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'postFilter'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }

    return value.filter((val) => {
      const rVal = (val.title.toLocaleLowerCase().includes(args));
      // const rVal = (val.title.toLocaleLowerCase().includes(args)) || (val.city.toLocaleLowerCase().includes(args));
      return rVal;
    });

  }
}
