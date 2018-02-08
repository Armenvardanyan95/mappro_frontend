import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import {OrderService, GoogleMapsService} from '../common/services';
import {TIME_VALUES} from 'app/settings';


@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit, OnChanges {

  private currentPlaceValue: ICoordinates;

  @Input() order?: IOrder;
  @Input() colors: IColorMarker[];
  @Input() users: IUser[];
  @Input() isInPopup: boolean = false;
  isMapVisible = false;

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
  public orderCount: number = 0;
  private initialValues = {
    name: '',
    address: '',
    mobilePhones: [],
    date: null,
    timeFrom: null,
    timeTo: null,
    lat: '',
    lng: '',
    problem: '',
    comment: '',
    colorMarker: '',
    user: ''
  };

  constructor(private formBuilder: FormBuilder, private snackBar: MdSnackBar,
              private orderService: OrderService, private googleMapsService: GoogleMapsService) {
    this.form = formBuilder.group({
      name: ['', []],
      address: ['', [Validators.required]],
      mobilePhones: [[]],
      date: [null, []],
      timeFrom: [null, []],
      timeTo: [null, []],
      lat: [''],
      lng: [''],
      problem: ['', []],
      comment: ['', []],
      colorMarker: [''],
      user: ['']
    });
  }

  ngOnInit() {
    this.findCoordinatesByAddress();
    if (this.order) {
      this.order.date = this.order.date ? new Date(this.order.date) : this.order.date;
      this.form.patchValue(this.order);
    } else {
      this.form.controls['colorMarker'].patchValue(this.colors.filter((color: IColorMarker) => color.new)[0].id);
      this.form.controls['user'].patchValue(this.users.filter((user: IUser) => user.isSuperuser)[0].id);
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['colors'] && (<IColorMarker[]>changes['colors'].currentValue)
        .map((color: IColorMarker) => color.id)
        .indexOf(this.form.controls['colorMarker'].value) === -1) {
      this.form.controls['colorMarker'].setValue(this.colors.filter((color: IColorMarker) => color.new)[0].id);
    }

    if (changes['users'] && (<IUser[]>changes['users'].currentValue)
        .map((user: IUser) => user.id)
        .indexOf(this.form.controls['user'].value) === -1
    ) {
      this.form.controls['user'].setValue(this.users.filter((user: IUser) => user.isSuperuser)[0].id);
    }
  }

  private findCoordinatesByAddress(): void {
    this.form.controls['address'].valueChanges
      .debounceTime(300)
      .subscribe(
        (val: string) => {
          this.orderService.countByAddress(val).subscribe(res => this.orderCount = res.count);
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
          this.orderUpdated.emit(null);
          this.form.patchValue(this.initialValues);
          this.form.controls['colorMarker'].patchValue(this.colors.filter((color: IColorMarker) => color.new)[0].id);
        },
        err => {
          const msgObj = err.json();
          this.snackBar.open(msgObj.message, 'OK')
        }
      );
  }

  private updateOrder(order: IOrder): void {
    this.orderService.update(order)
      .subscribe(
        res => {
          this.orderUpdated.emit(null);
        },
        err => this.snackBar.open('Order was not updated due to an error', 'OK')
      );
  }

  getNormalTimeFromAmPm(time: ITime): string {
    const convertFromAmPm = (t: number, i: number) => {
      if (!i) {
        if (time.type === 'pm') {
          return t + 12;
        } else {
          return t;
        }
      } else {
        return t;
      }
    };
    const mapToHourOrMinuteWithZero = (t: string) => t.length === 1 ? `0${t}` : t;
    const times: Array<number> = time.time.split(':').map((t: string) => +t);
    const realTime: string = times
      .map(convertFromAmPm)
      .map((t: number) => t.toString())
      .map(mapToHourOrMinuteWithZero)
      .join(':');
    realTime;
    return realTime;
  }

  selectPlace(place: ILocation): void {
    this.googleMapsService.getLocationById(place.placeId)
      .subscribe((res: ILocationSearchResults) => {
        this.currentPlace = res.results[0].geometry.location;
        this.form.controls['lat'].setValue(this.currentPlace.lat);
        this.form.controls['lng'].setValue(this.currentPlace.lng);
      });
  }

  setMarker(event: {coords: ICoordinates}): void {
    this.currentPlace = event.coords;
  }

  onSubmit(values: IOrder){
    this.submitted = true;
    if (!(this.form.controls['lat'] && this.form.controls['lat'] )) {
      this.form.controls['lat'].setValue(this.currentPlace.lat);
      this.form.controls['lng'].setValue(this.currentPlace.lng);
    }
    if (this.isInPopup) {
      values.lat = this.currentPlace.lat;
      values.lng = this.currentPlace.lng;
    }
    if(this.form.valid){
      const order: IOrder = values;
      if (this.order) {
        order.id = this.order.id;
        this.updateOrder(order);
      } else {
        this.createOrder(order);
      }
    }
  }

}
