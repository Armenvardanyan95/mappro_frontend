import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {LocalStorageService} from 'angular-2-local-storage';
import {Observable} from "rxjs";
import {SelectItem} from "primeng/components/common/selectitem";

@Injectable()
export class ColorMarkerService {

  private baseUrl: string = 'http://mappro.vioo.xyz:8000/colors/';

  constructor(private http: Http, private localStorage: LocalStorageService) { }

  private get makeRequestOptions(): RequestOptions {
    const token = this.localStorage.get('token');
    const headers: Headers =  new Headers({Authorization: `Token ${token}`});
    return new RequestOptions({headers: headers});
  }

  create(values: IColorMarker): Observable<IColorMarker> {
    return this.http.post(this.baseUrl, values, this.makeRequestOptions).map((res: Response) => res.json());
  }

  all(): Observable<any> {
    return this.http.get(this.baseUrl, this.makeRequestOptions)
      .map((res: Response) => res.json())
      .switchMap(c => c)
      .filter((color: IColorMarker) => !color.default)
      .toArray();
  }

  delete(color: {password: string, id: number}): Observable<any> {
    return this.http.post(`${this.baseUrl}delete-marker/`, color, this.makeRequestOptions).map((res: Response) => res.json());
  }

  asSelectItem(): Observable<SelectItem[]> {
    return this.all()
        .switchMap(c => c)
        .map((color: IColorMarker) => {
          return {
            label: `${color.name}`,
            value: color.id
          };
        })
        .toArray()
  }

}
