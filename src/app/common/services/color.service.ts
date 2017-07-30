import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {LocalStorageService} from 'angular-2-local-storage';
import {Observable} from "rxjs";

@Injectable()
export class ColorMarkerService {

  private baseUrl: string = 'http://127.0.0.1:8000/colors/';

  constructor(private http: Http, private localStorage: LocalStorageService) { }

  private get makeRequestOptions(): RequestOptions {
    const token = this.localStorage.get('token');
    const headers: Headers =  new Headers({Authorization: `Token ${token}`});
    return new RequestOptions({headers: headers});
  }

  create(values: IColorMarker): Observable<any> {
    return this.http.post(this.baseUrl, values, this.makeRequestOptions).map((res: Response) => res.json());
  }

  all(): Observable<any> {
    return this.http.get(this.baseUrl, this.makeRequestOptions).map((res: Response) => res.json());
  }

}
