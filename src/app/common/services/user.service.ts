import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import {Observable} from "rxjs";
import 'rxjs/Rx';
import {SelectItem} from "primeng/components/common/selectitem";


@Injectable()
export class UserService {

  private baseUrl: string = 'http://mappro.vioo.xyz:8000/users/';
  private baseUrlWithoutUser: string = 'http://mappro.vioo.xyz:8000/';
  private baseAuthUrl: string = 'http://mappro.vioo.xyz:8000/api-token-auth/';

  constructor(private http: Http, private localStorage: LocalStorageService) {}

  private get makeRequestOptions(): RequestOptions {
    const token = this.localStorage.get('token');
    const headers: Headers =  new Headers({Authorization: `Token ${token}`});
    return new RequestOptions({headers: headers});
  }

  all(): Observable<Array<IUser>> {
    return this.http.get(this.baseUrl, this.makeRequestOptions).map((res: Response) => res.json());
  }

  create(user: IUser): Observable<IUser> {
    return this.http.post(this.baseUrl, user, this.makeRequestOptions).map((res: Response) => res.json());
  }

  authenticate(credentials: IUserAuth): Observable<{token: string}> {
    return this.http.post(this.baseAuthUrl, credentials).map((res: Response) => res.json());
  }

  update(user: IUser): Observable<any> {
    if (!user.password) delete user.password;
    return this.http.patch(`${this.baseUrl}${user.id}/`, user, this.makeRequestOptions).map((res: Response) => res.json());
  }

  delete(data: {password: string, ids: number[]}): Observable<any> {
    return this.http.post(`${this.baseUrlWithoutUser}delete-user/`, data, this.makeRequestOptions);
  }

  asSelectItem(): Observable<SelectItem[]> {
    return this.all()
        .switchMap(u => u)
        .map((user: IUser) => {
          return {
            label: `${user.firstName} ${user.lastName}`,
            value: user.id
          };
        })
        .toArray();
  }

}
