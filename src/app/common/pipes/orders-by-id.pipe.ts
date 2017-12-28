import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordersByID'
})
export class OrdersByIDPipe implements PipeTransform {

  transform(orders: IOrder[], rank: number): any {
    if (rank) {
      return orders.filter(order => order.notArchivedRank === rank);
    }

    return orders;
  }

}
