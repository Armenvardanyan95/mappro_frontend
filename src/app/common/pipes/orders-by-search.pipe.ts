import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordersBySearch'
})
export class OrdersBySearchPipe implements PipeTransform {

  transform(orders: IOrder[], q: string, colors: number[], users: number[]): any {
    return orders.filter((order: IOrder) => {
      const query = q.toLowerCase();
      const orderBelongsToUser: boolean = users.length ? order.user && users.indexOf(order.userDetails.id) !== -1 : true;
      const orderBelongsToColor: boolean = colors.length ? order.colorMarkerDetails && colors.indexOf(order.colorMarkerDetails.id) !== -1 : true;
      return orderBelongsToUser && orderBelongsToColor && (
        order.address.toLowerCase().indexOf(query) !== -1 ||
        order.mobilePhone.toLowerCase().indexOf(query) !== -1 ||
        order.name && order.name.toLowerCase().indexOf(query) !== -1
      );
    });
  }

}
