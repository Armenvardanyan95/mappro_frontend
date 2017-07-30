import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable()
export class GoogleMapsService {

  private autcompleteUrl: string = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${environment.googleMapsApiKey}`;
  private locationByIDUrl: string = `https://maps.googleapis.com/maps/api/geocode/json?key=${environment.googleMapsApiKey}`

  constructor(private http: Http) { }

  getLocationByInput(input: string): Observable<{predictions: Array<ILocation>, status: string}> {
    return this.http.get(`${this.autcompleteUrl}&input=${input}`).map(res => res.json());
  }

  getLocationById(id: string): Observable<{results: Array<ILocationDetails>, status: string}> {
    return this.http.get(`${this.locationByIDUrl}&place_id=${id}`).map(res => res.json());
  }

}
