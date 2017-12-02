import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import { MapsAPILoader } from '@agm/core';


declare const gapi: any;

@Injectable()
export class GoogleMapsService {

  private autocompleteUrl: string = `http://mappro.vioo.xyz:8000/google-maps-autocomplete/`;
  private locationByIDUrl: string = `https://maps.googleapis.com/maps/api/geocode/json?key=${environment.googleMapsApiKey}`

  constructor(private http: Http, private mapsAPILoader: MapsAPILoader) { }

  getLocationByInput(input: string): Observable<{predictions: Array<ILocation>, status: string}> {
    console.log(gapi.load());
    return this.http.get(`${this.autocompleteUrl}?address=${input}`).map(res => res.json());
  }

  getLocationById(id: string): Observable<{results: Array<ILocationDetails>, status: string}> {
    return this.http.get(`${this.locationByIDUrl}&place_id=${id}`).map(res => res.json());
  }

}
