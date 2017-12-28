import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorTransform'
})
export class ColorPipe implements PipeTransform {

  transform(value: IColorMarker[], color: number): string {
    return value.filter((c: IColorMarker) => c.id === color).map((c: IColorMarker) => c.color)[0];
  }

}
