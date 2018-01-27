import { Component, OnInit } from '@angular/core';
import {OrderService} from '../common/services/order.service';
import { MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {LazyLoadEvent, SelectItem} from 'primeng/primeng';
import {ColorMarkerService} from '../common/services/color.service';
import {UserService} from '../common/services/user.service';
import {OrderDeleteComponent} from "../order-delete/order-delete.component";
import {BrowserService} from "../common/services/browser.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['table.component.scss']
})
export class TableComponent implements OnInit {

  orders: IOrder[] = [];
  count: number = 0;
  loading: boolean = false;
  colors: SelectItem[] = [];
  users: SelectItem[] = [];
  selectedOrders: IOrder[] = [];
  latestSearchParams: LazyLoadEvent;

  constructor(private orderService: OrderService, private dialog: MatDialog, private browser: BrowserService,
              private colorService: ColorMarkerService, private userService: UserService) { }

  ngOnInit() {
    this.colorService.asSelectItem().subscribe(colors => this.colors = colors);
    this.userService.asSelectItem().subscribe(users => this.users = users);
    this.browser.onBecameVisible.filter(value => !value).subscribe(() => this.lazyLoadOrders(this.latestSearchParams));
  }

  lazyLoadOrders(event: LazyLoadEvent) {
    this.loading = true;
    this.latestSearchParams = event;
    const filters = {};
    if (event.filters) {
      for (const key in event.filters) {
        if (event.filters.hasOwnProperty(key)) {
          filters[key] = event.filters[key].value;
        }
      }
    }
    this.orderService.getTableOrders({page: (event.first + 20) / 20, ...filters})
        .subscribe((data: {count: number, data: IOrder[]}) => {
          this.count = data.count;
          this.orders = data.data.map(order => {
            order.mobilePhone = order.mobilePhone.split('&').join(', ');
            return order;
          });
          this.loading = false;
        });
  }

  deleteOrders(orders: IOrder[]): void {
    const dialog: MatDialogRef<OrderDeleteComponent> = this.dialog.open(OrderDeleteComponent);
    const ordersToBeDeletedIDs = orders.map((order: IOrder) => order.id);
    dialog.componentInstance.orders = ordersToBeDeletedIDs;
    dialog.componentInstance.dialogClosed.subscribe(() => dialog.close());
    dialog.componentInstance.colorDeleted.subscribe(() => {
      dialog.close();
      this.lazyLoadOrders(this.latestSearchParams);
      this.orders = this.orders.filter((order: IOrder) => ordersToBeDeletedIDs.indexOf(order.id) === -1);
    });
  }

  archiveOrder(id: number): void {
    this.orderService.archive([id]).subscribe(() => this.lazyLoadOrders(this.latestSearchParams));
  }

  dearchiveOrder(id: number): void {
    this.orderService.dearchive([id]).subscribe(() => this.lazyLoadOrders(this.latestSearchParams));
  }

}
