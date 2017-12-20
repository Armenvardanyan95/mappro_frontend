import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import {FormGroup} from '@angular/forms';
import { AgmMarker } from '@agm/core';
import { SelectItem } from 'primeng/primeng';

import {UserService, ColorMarkerService, OrderService} from "app/common/services";
import {ColorMarkerComponent} from "../color-marker/color-marker.component";
import {BrowserService} from "../common/services/browser.service";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  entryComponents: [ColorMarkerComponent],
})
export class AdminComponent implements OnInit {

  @ViewChild('map') map: any;

  public form: FormGroup;
  public idQuery: number;
  public submitted: boolean = false;
  public showNewOrderForm: boolean = false;
  public colors: Array<IColorMarker>;
  public orders: Array<IOrder> = [];
  public currentPlace: ICoordinates = <ICoordinates>{lat: 40.6489710, lng: -74.1698883};
  public markerCoordinates: ICoordinates;
  public zoom: number = 8;
  public allSelected: boolean = false;
  public allOrders: IOrder[] = [];
  public selectFromMode: boolean = false;
  public selectToMode: boolean = false;
  public archiveMode: boolean = false;
  public search: {query: string, colors: number[], users: number[]} = {query: '', colors: [], users: []};

  users: Array<IUser>;
  title: string = 'My first AGM project';

  constructor(private userService: UserService, private colorMarkerService: ColorMarkerService,
              private browser: BrowserService, private orderService: OrderService) {
  }

  ngOnInit() {
    this.getData();
    this.browser.onBecameVisible.filter(value => !value).subscribe(() => this.getOrders());
  }

  selectAll() {
    for (const order of this.orders) {
      order.isSelected = this.allSelected;
    }
    this.selectFromMode = this.selectToMode = false;
  }

  deSelectAll() {
    for (const order of this.orders) {
      order.isSelected = false;
    }
  }

  addNewUser(user: IUser): void {
    this.users.push(user);
  }

  searchOrders(): void {
    this.orders = this.allOrders.filter((order: IOrder) => {
      const query = this.search.query.toLowerCase();
      const orderBelongsToUser: boolean = this.search.users.length ? order.user && this.search.users.indexOf(order.userDetails.id) !== -1 : true;
      const orderBelongsToColor: boolean = this.search.colors.length ? order.colorMarkerDetails && this.search.colors.indexOf(order.colorMarkerDetails.id) !== -1 : true;
      return orderBelongsToUser && orderBelongsToColor && (
          order.address.toLowerCase().indexOf(query) !== -1 ||
          order.mobilePhone.toLowerCase().indexOf(query) !== -1 ||
          order.name && order.name.toLowerCase().indexOf(query) !== -1
        );
    })
  }

  selectFromModeOn() {
    this.selectToMode = false;
    this.allSelected = false;
    this.deSelectAll();
  }

  selectToModeOn() {
    this.selectFromMode = false;
    this.allSelected = false;
    this.deSelectAll();
  }

  resetMarker(): void {
    this.markerCoordinates = null;
  }

  resetMarkerToLastLocation(): void {
    this.currentPlace = <ICoordinates>{...this.markerCoordinates};
    this.markerCoordinates = null;
  }

  private getData(): void {
    this.getUsers();
    this.getColors();
    this.getOrders();
  }

  public getUsers(): void {
    this.userService.all()
      .subscribe(
        (users: Array<IUser>) => this.users = users,
        (err: any) => console.log(err)
      );
  }

  public getColors(): void {
    this.colorMarkerService.all().subscribe((res: Array<IColorMarker>) => this.colors = res);
  }

  get selectedOrderIds(): number[] {
    return this.orders.filter((order: IOrder) => order.isSelected).map((order: IOrder) => order.id);
  }

  public getOrders(): void {
    this.orderService.getAll()
      .do(() => {
        this.orders = [];
        this.allOrders = [];
      })
      .switchMap(res => res)
      .map((order: IOrder) => {
        order.isVisible = false;
        order.isSelected = false;
        if (order.timeTo || order.timeFrom) {
          const removeTrailingZeros = (time: string) => time.split(':').slice(0, 2).join(':');
          if (order.timeTo) {
            order.timeTo = removeTrailingZeros(order.timeTo);
          }
          if (order.timeFrom) {
            order.timeFrom = removeTrailingZeros(order.timeFrom);
          }
        }
        return order;
      })
      .subscribe((order: IOrder) => {
        this.orders.push(order);
        this.allOrders.push(order);
      });
  }

  setMarker(event: {coords: ICoordinates}): void {
    this.zoomTo(event.coords);
    this.markerCoordinates = event.coords;
    this.showNewOrderForm = true;
  }

  zoomTo(orderInstance: ICoordinates): void {
    this.currentPlace = {lat: orderInstance.lat, lng: orderInstance.lng};
  }

  setMarkerTitle(markerRef: AgmMarker): void {
    // this.markerManager.updateLabel(markerRef).then(console.log);
    // this.markerManager.getNativeMarker(markerRef).then(
    //   (marker: Marker) => {
    //     console.log(marker, 'aaaa')
    //   }
    // );
  }

  changeOrderVisibility(orderInstance: IOrder, markerRef?: AgmMarker): void {
    if (markerRef) {
      this.setMarkerTitle(markerRef);
    }
    for (const order of this.orders) {
      if (order.isVisible && order.id !== orderInstance.id) {
        order.isVisible = false;
      }
    }
    this.zoom = 16;
    this.zoomTo(orderInstance);
  }

  orderHasBeenSelected(index: number) {
    if (this.selectFromMode) {
      for (let i = this.orders.length - index; i < this.orders.length; i++) {
        this.orders[i].isSelected = true;
      }
    } else if (this.selectToMode) {
      for (let i = 0; i < this.orders.length - index; i++) {
        this.orders[i].isSelected = true;
      }
    }
  }

  toggleShowNewOrderForm(event: boolean) {
    this.showNewOrderForm = event;
  }

  archived(ids: number[]): void {
    this.getOrders();
  }

  mapUsersToSelectItem(users: IUser[]): SelectItem[] {
    if(!users) return [];
    return users.map((user: IUser) => {
      return {
        label: `${user.firstName} ${user.lastName}`,
        value: user.id
      };
    });
  }

  mapColorsToSelectItem(colors: IColorMarker[]): SelectItem[] {
    if(!colors) return [];
    return colors.map((color: IColorMarker) => {
      return {
        label: `${color.name}`,
        value: color.id
      };
    });
  }
}
