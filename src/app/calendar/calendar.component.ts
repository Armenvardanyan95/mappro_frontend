import { Component, OnInit, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import {TIME_VALUES, DAYS, CALENDAR_SETTINGS} from 'app/settings';
import { UserService, OrderService, ColorMarkerService } from 'app/common/services';
import { OrderDeleteComponent } from '../order-delete/order-delete.component';
import { OrderDeleteByDateComponent } from '../order-delete-by-date/order-delete-by-date.component';
import {SelectItem} from "primeng/components/common/selectitem";


declare type TimeFormat = 'am' | 'pm';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit, OnChanges {

  days: number[] = [];
  dayNames: string[] = DAYS;
  calendar: any[];
  en = CALENDAR_SETTINGS;
  dateRange: [Date, Date] = [new Date(), new Date()];
  users: IUser[] = [];
  colors: IColorMarker[] = [];
  colorItems: SelectItem[] = [];
  selectedOrder: IOrder;
  doFilterOrders: boolean = false;
  selectFromMode: boolean = false;
  selectToMode: boolean = false;
  allSelected: boolean = false;
  orders: IOrder[] = [];
  archiveMode: boolean = false;
  className = 'allah';
  search = {
    search: '',
    date: null,
    colors: []
  };

  constructor(private userService: UserService, private orderService: OrderService,
              private colorMarkerService: ColorMarkerService, private dialog: MdDialog, private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.setWeek();
    this.searchForOrders();
    this.userService.all().switchMap((users: IUser[]) => users).map((user: IUser) => {
      user.isSelected = false;
      return user;
    }).subscribe((user: IUser)=> this.users.push(user));
    this.colorMarkerService.all().switchMap((colors: IColorMarker[]) => colors).map((color: IColorMarker) => {
      color.isSelected = false;
      return color;
    })
      .toArray()
      .subscribe((colors: IColorMarker[]) => this.colors = colors);
    this.colorMarkerService.asSelectItem().subscribe((colors: SelectItem[]) => this.colorItems = colors);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, 'changes');
  }

  private getWeekDays(date: Date): [Date, Date] {
    const first = date.getDate() - date.getDay() + 1; // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6

    const firstday = new Date(date.setDate(first));
    const lastday = new Date(date.setDate(last));
    return [firstday, lastday];
  }

  public searchForOrders(): void {
    this.orderService.filterOrders({
      users: this.users.filter((user: IUser) => user.isSelected).map(u => u.id),
      range: this.dateRange,
      colors: this.colors.filter((color: IColorMarker) => color.isSelected).map(c => c.id)
    }).map((orders: IOrder[]) => {

      for (let order of orders) {
        if (order.timeTo || order.timeFrom) {
          const removeTrailingZeros = (time: string) => time.split(':').slice(0, 2).join(':');
          if (order.timeTo) {
            order.timeTo = removeTrailingZeros(order.timeTo);
          }
          if (order.timeFrom) {
            order.timeFrom = removeTrailingZeros(order.timeFrom);
          }
        }
      }
      return orders;
    })
      .subscribe((res: IOrder[]) => this.calendar = this.makeTableData(res));
  }

  updateOrderColor(order: IOrder): void {
    this.orderService.changeOrderColor(order.id, order.colorMarkerDetails.id)
      .subscribe(res => this.searchForOrders());
  }

  private formatAMPM(date: string): string {
    const dateArray: string[] = date.split(':');
    var hours = +dateArray[0];
    var minutes = +dateArray[1];
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesFinal = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutesFinal + ' ' + ampm;
    return strTime;
  }

  public formatAMPMObject(date: string): {time: string, type: TimeFormat} {
    const time: [string, TimeFormat] = <[string, TimeFormat]>this.formatAMPM(date).split(' ');
    return {time: time[0], type: time[1]};
  }

  private setWeek(): void {
    const weekRange = this.getWeekDays(this.dateRange[0]);
    this.dateRange[0] = weekRange[0];
    this.dateRange[1] = weekRange[1];
    console.log(this.dateRange, 'range');
  }

  private daysInMonth(month: Date) {
    return new Date(month.getFullYear(), month.getMonth()+1, 0).getDate();
  }

  makeTableData(orders: IOrder[]) {
    const finalData = [];
    for (const time of TIME_VALUES) {
      const days = {};
      this.days = [];
      const startDay: number = this.dateRange[0].getDate();
      const endDay: number = this.dateRange[1].getDate();
      const dayCount: number = this.daysInMonth(this.dateRange[0]);
      let next: number = startDay;
      const dayArray: number[] = [];
      while (next !== endDay) {
        dayArray.push(next);
        if (next === dayCount) {
          next = 1;
        } else {
          next++;
        }
      }
      dayArray.push(endDay);
      for (let i of dayArray) {
        this.days.push(i);
        days[i] = <any>{};
        days[i].orders = orders.filter((order: IOrder) => {
          const timesMatch: boolean = this.formatAMPM(<string>order.timeFrom) === `${time.time} ${time.type}`;
          const daysMatch: boolean = (new Date(<string>order.date)).getDate() === i;
          return timesMatch && daysMatch;
        });
      }
      days['time'] = time;
      finalData.push(days);
    }
    console.log('finalData', finalData);
    return finalData;
  }

  selectUsers(): void {
    if (this.dateRange[0] && this.dateRange[1]) {
      this.searchForOrders();
    }
  }

  selectedDate(): void {
    this.setWeek();
    if (this.dateRange[0] && this.dateRange[1]) {
      this.searchForOrders();
    }
  }

  changeOrderVisibility(orderInstance: IOrder): void {
    for (const order of this.orders) {
      if (order.isVisible && order.id !== orderInstance.id) {
        order.isVisible = false;
      }
    }
  }

  selectOrder(order: IOrder, event: Event): void {
    event.preventDefault();
    this.selectedOrder = null;
    setTimeout(() => this.selectedOrder = order, 0);
  }

  deleteOrder(event: MouseEvent, order: IOrder): void {
    event.stopPropagation();
    const dialog: MdDialogRef<OrderDeleteComponent> = this.dialog.open(OrderDeleteComponent);
    dialog.componentInstance.orders = [order.id];
    dialog.componentInstance.dialogClosed.subscribe(() => dialog.close());
    dialog.componentInstance.colorDeleted.subscribe(() => {
      dialog.close();
      this.searchForOrders();
    });
  }

  private hexToRgb(hex: string) {
    const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  public makeRGBWithAlpha(hex: string): string {
    const rgb = this.hexToRgb(hex);
    const rgbString = `rgba(${rgb.r},${rgb.g},${rgb.b},0.2)`;
    return rgbString;
  }

  public deleteMultipleOrders() {
    const dialog: MdDialogRef<OrderDeleteByDateComponent> = this.dialog.open(OrderDeleteByDateComponent);
    dialog.componentInstance.ordersDeleted.subscribe(() => {
      dialog.close();
      this.searchForOrders();
    });
  }

  public massFilterOrders() {
    this.orderService.massFilter(this.search).subscribe(res => this.orders = res);
  }

  public filterOrdersWithoutDate(): void {
    this.orderService.filterOrdersWithoutDate().subscribe(res => this.orders = res);
  }

  private s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  enableArchiveModeOrDelete(): void {
    if (!this.archiveMode) {
      this.archiveMode = true;
    } else {
      this.archiveMode = false;
      const dialog: MdDialogRef<OrderDeleteComponent> = this.dialog.open(OrderDeleteComponent);
      const ordersToBeDeletedIDs = this.selectedOrderIDs();
      dialog.componentInstance.orders = ordersToBeDeletedIDs;
      dialog.componentInstance.dialogClosed.subscribe(() => dialog.close());
      dialog.componentInstance.colorDeleted.subscribe(() => {
        dialog.close();
        this.searchForOrders();
        this.orders = this.orders.filter((order: IOrder) => ordersToBeDeletedIDs.indexOf(order.id) === -1);
      });
    }
  }

  orderHasBeenSelected(index: number) {
    if (this.selectFromMode) {
      for (let i = index; i < this.orders.length; i++) {
        this.orders[i].isSelected = true;
      }
    } else if (this.selectToMode) {
      for (let i = 0; i <= index; i++) {
        this.orders[i].isSelected = true;
      }
    }
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

  selectedOrderIDs(): number[] {
    return this.orders
      .filter((order: IOrder) => order.isSelected)
      .map((order: IOrder) => order.id);
  }

}
