import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import {Observable} from "rxjs";
import 'rxjs/Rx';


@Injectable()
export class UserService {

  private baseUrl: string = 'http://127.0.0.1:8000/users/';
  private baseAuthUrl: string = 'http://127.0.0.1:8000/api-token-auth/';

  constructor(private http: Http, private localStorage: LocalStorageService) {}

  private get makeRequestOptions(): RequestOptions {
    const token = this.localStorage.get('token');
    const headers: Headers =  new Headers({Authorization: `Token ${token}`});
    return new RequestOptions({headers: headers});
  }

  all(): Observable<Array<IUser>> {
    return this.http.get(this.baseUrl, this.makeRequestOptions).map((res: Response) => res.json());
  }

  create(user: IUser): Observable<void> {
    return this.http.post(this.baseUrl, user, this.makeRequestOptions).map((res: Response) => res.json());
  }

  authenticate(credentials: IUserAuth): Observable<{token: string}> {
    return this.http.post(this.baseAuthUrl, credentials).map((res: Response) => res.json());
  }

}
