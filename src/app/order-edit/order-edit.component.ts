import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import {OrderService, GoogleMapsService} from '../common/services';
import {TIME_VALUES} from 'app/settings';


@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {

  private currentPlaceValue: ICoordinates;

  @Input() order?: IOrder;
  @Input() colors: IColorMarker[];
  @Input() users: IUser[];

  @Input()
  get currentPlace(): ICoordinates {
    return this.currentPlaceValue;
  };
  @Output() currentPlaceChange: EventEmitter<ICoordinates> = new EventEmitter();
  set currentPlace(value: ICoordinates) {
    this.currentPlaceValue = value;
    this.currentPlaceChange.emit(this.currentPlaceValue);
  }
  @Output() orderUpdated: EventEmitter<null> = new EventEmitter();
  public form: FormGroup;
  public submitted: boolean = false;
  public places: Array<ILocation> = [];
  public times: Array<ITime> = TIME_VALUES;

  constructor(private formBuilder: FormBuilder, private snackBar: MdSnackBar,
              private orderService: OrderService, private googleMapsService: GoogleMapsService) {
    this.form = formBuilder.group({
      name: ['', []],
      address: ['', []],
      mobilePhone: ['', []],
      date: ['', []],
      timeFrom: ['', []],
      timeTo: ['', []],
      problem: ['', []],
      comment: ['', []],
      color: [''],
      user: ['']
    });
  }

  ngOnInit() {
    this.findCoordinatesByAddress();
    if (this.order) {
      console.log(this.order.timeFrom);
      console.log(this.order.timeTo);
      this.form.patchValue(this.order);
    }
  }

  private findCoordinatesByAddress(): void {
    this.form.controls['address'].valueChanges
      .debounceTime(300)
      .subscribe(
        (val: string) => {
          this.googleMapsService
            .getLocationByInput(val)
            .subscribe((res: {predictions: Array<ILocation>, status: string}) => this.places = res.predictions);
        }
      );
  }

  private createOrder(order: IOrder): void {
    this.orderService.create(order)
      .subscribe(
        res => {
          this.snackBar.open('Order Successfully Placed', 'OK');
          this.orderUpdated.emit(null);
        },
        err => this.snackBar.open('Order was not placed due to an error', 'OK')
      );
  }

  private updateOrder(order: IOrder): void {
    this.orderService.update(order)
      .subscribe(
        res => {
          this.snackBar.open('Order Successfully Updated', 'OK');
          this.orderUpdated.emit(null);
        },
        err => this.snackBar.open('Order was not updated due to an error', 'OK')
      );
  }

  getNormalTimeFromAmPm(time: ITime): string {
    const convertFromAmPm = (t: number, i: number) => !i ? time.type === 'pm' ? t + 12 : t : t;
    const mapToHourOrMinuteWithZero = (t: string) => t.length === 1 ? `0${t}` : t;
    const times: Array<number> = time.time.split(':').map((t: string) => +t);
    const realTime: string = times
      .map(convertFromAmPm)
      .map((t: number) => t.toString())
      .map(mapToHourOrMinuteWithZero)
      .join(':');
    return realTime;
  }

  selectPlace(place: ILocation): void {
    this.googleMapsService.getLocationById(place.place_id)
      .subscribe((res: ILocationSearchResults) => this.currentPlace = res.results[0].geometry.location);
  }

  onSubmit(values: IOrder){
    this.submitted = true;
    console.log(values);
    if(this.form.valid){
      const order: IOrder = values;
      order.lat = this.currentPlace.lat;
      order.lng = this.currentPlace.lng;
      if (this.order) {
        this.updateOrder(order);
      } else {
        this.createOrder(order);
      }
    }
  }

}
