import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Observable} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class OrderService {

  private baseUrl: string = 'http://127.0.0.1:8000/orders/';

  constructor(private http: Http, private localStorage: LocalStorageService) { }

  private get makeRequestOptions(): RequestOptions {
    const token = this.localStorage.get('token');
    const headers: Headers =  new Headers({Authorization: `Token ${token}`});
    return new RequestOptions({headers: headers});
  }

  create(data: IOrder): Observable<any> {
    return this.http.post(this.baseUrl, data, this.makeRequestOptions).map(res => res.json());
  }

  update(data: IOrder): Observable<void> {
    return this.http.patch(this.baseUrl, data, this.makeRequestOptions).map(res => res.json());
  }

  getAll(): Observable<Array<IOrder>> {
    return this.http.get(this.baseUrl, this.makeRequestOptions).map(res => res.json());
  }

  archive(orderIds: number[]): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/archive/', orderIds);
  }

}
