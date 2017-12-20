import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Observable} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class OrderService {

  private baseUrl: string = 'http://mappro.vioo.xyz:8000/orders/';
  private baseUrlWithoutOrders: string = 'http://mappro.vioo.xyz:8000/';

  constructor(private http: Http, private localStorage: LocalStorageService) { }

  private get makeRequestOptions(): RequestOptions {
    const token = this.localStorage.get('token');
    const headers: Headers =  new Headers({Authorization: `Token ${token}`});
    return new RequestOptions({headers: headers});
  }

  create(data: IOrder): Observable<any> {
    data.mobilePhone = data.mobilePhones.join('&');
    return this.http.post(this.baseUrl, data, this.makeRequestOptions).map(res => res.json());
  }

  update(data: IOrder): Observable<void> {
    data.mobilePhone = data.mobilePhones.join('&');
    return this.http.patch(`${this.baseUrl}${data.id}/`, data, this.makeRequestOptions).map(res => res.json());
  }

  getAll(): Observable<Array<IOrder>> {
    return this.http.get(this.baseUrl, this.makeRequestOptions)
      .map(res => res.json())
      .switchMap(o => o).map((order: IOrder) => {
        order.mobilePhones = order.mobilePhone.split('&');
        return order;
      })
      .toArray();
  }

  archive(orderIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}archive/`, orderIds, this.makeRequestOptions);
  }

  dearchive(orderIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}dearchive/`, orderIds, this.makeRequestOptions);
  }


  countByAddress(address: string): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}count/`, address, this.makeRequestOptions)
      .map(res => res.json())
      .switchMap(o => o).map((order: IOrder) => {
        order.mobilePhones = order.mobilePhone.split('&');
        return order;
      })
      .toArray();
  }

  filterOrders(search: IOrderSearch): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}filter/`, search, this.makeRequestOptions)
      .map(res => res.json())
      .switchMap(o => o).map((order: IOrder) => {
        order.mobilePhones = order.mobilePhone.split('&');
        return order;
      })
      .toArray();
  }

  delete(data: {password: string; ids: number[]}): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}orders/delete/`, data, this.makeRequestOptions).map(res => res.json());
  }

  deleteByDate(dates: {from: Date, to: Date}): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}delete/by-date/`, dates, this.makeRequestOptions).map(res => res.json());
  }

  massFilter(data: {date: Date, colors: number[], search: string}): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}mass-filter/`, data, this.makeRequestOptions)
      .map(res => res.json())
      .switchMap(o => o).map((order: IOrder) => {
        order.mobilePhones = order.mobilePhone.split('&');
        return order;
      })
      .toArray();
  }

  filterOrdersWithoutDate(): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}no-date/`, {}, this.makeRequestOptions)
      .map(res => res.json())
      .switchMap(o => o).map((order: IOrder) => {
        order.mobilePhones = order.mobilePhone.split('&');
        return order;
      })
      .toArray();
  }

  filterMyOrders(): Observable<any> {
    return this.http.get(`${this.baseUrlWithoutOrders}my-orders`, this.makeRequestOptions)
      .map(res => res.json())
      .map((res: IOrder[]) => {
        const finalArray: {date: any, orders: IOrder[]}[] = [];
        res.forEach((order: IOrder) => {
          order.mobilePhones = order.mobilePhone.split('&');
          const matchingDates: any[] = finalArray.filter((day) => day.date == order.date).map(day => day.date);
          if (matchingDates.length) {
            const index: number = matchingDates.indexOf(order.date);
            finalArray[index].orders.push(order);
          } else {
            finalArray.push({date: order.date, orders: [order]});
          }
        });
        return finalArray;
      });
  }

  filterMyOrdersByDate(date: Date): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}my-orders-by-date/`, {date: date}, this.makeRequestOptions)
      .map(res => res.json())
      .map((res: IOrder[]) => {
        const finalArray: {date: any, orders: IOrder[]}[] = [];
        res.forEach((order: IOrder) => {
          order.mobilePhones = order.mobilePhone.split('&');
          const matchingDates: any[] = finalArray.filter((day) => day.date == order.date).map(day => day.date);
          if (matchingDates.length) {
            const index: number = matchingDates.indexOf(order.date);
            finalArray[index].orders.push(order);
          } else {
            finalArray.push({date: order.date, orders: [order]});
          }
        });
        return finalArray;
      });
  }

  filterUserOrders(userID: number): Observable<any> {
    return this.http.get(`${this.baseUrlWithoutOrders}user-orders/${userID}`, this.makeRequestOptions)
      .map(res => res.json())
      .map((res: IOrder[]) => {
        const finalArray: {date: any, orders: IOrder[]}[] = [];
        res.forEach((order: IOrder) => {
          order.mobilePhones = order.mobilePhone.split('&');
          const matchingDates: any[] = finalArray.filter((day) => day.date == order.date).map(day => day.date);
          if (matchingDates.length) {
            const index: number = matchingDates.indexOf(order.date);
            finalArray[index].orders.push(order);
            finalArray[index].orders.sort((ord1: IOrder, ord2: IOrder) => {
              const [h1, m1] = ord1.timeFrom.split(':');
              const date1 = new Date();
              date1.setHours(+h1);
              date1.setMinutes(+m1);

              const [h2, m2] = ord2.timeFrom.split(':');
              const date2 = new Date();
              date2.setHours(+h2);
              date2.setMinutes(+m2);

              return date1 > date2 ? 1 : -1;
            });
          } else {
            finalArray.push({date: order.date, orders: [order]});
          }
        });
        return finalArray;
      });
  }

  changeOrderColor(orderID: number, colorID: number): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}my-orders/`, {
      order: orderID,
      color: colorID
    }, this.makeRequestOptions).map(res => res.json());
  }

  getTableOrders(filters?: {[key: number]: any}): Observable<{count: number, data: IOrder[]}> {
        return this.http.post(`${this.baseUrlWithoutOrders}table/`, filters, this.makeRequestOptions)
          .map(res => res.json());
  }

  getFileBlob(order: IOrder): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutOrders}invoice/`, {pk: order.id}, this.makeRequestOptions).map(res => res.json());
  }

}
