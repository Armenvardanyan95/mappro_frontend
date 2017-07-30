import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig} from '@angular/material';

import {OrderEditComponent} from "../order-edit/order-edit.component";


@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css'],
  entryComponents: [OrderEditComponent]
})
export class OrderViewComponent implements OnInit {

  @Input() order: IOrder;
  @Input() users: IUser[];
  @Input() colors: IColorMarker[];
  @Output() orderMadeVisible: EventEmitter<number> = new EventEmitter();

  constructor(private dialog: MdDialog) { }

  ngOnInit() {
  }

  private setEditDialogData(dialog: MdDialogRef<OrderEditComponent>): void {
    dialog.componentInstance.colors = this.colors;
    dialog.componentInstance.users = this.users;
    dialog.componentInstance.order = this.order;
  }

  openEditDialog(): void {
    const dialog: MdDialogRef<OrderEditComponent> = this.dialog.open(OrderEditComponent, <MdDialogConfig>{
      width: '500px',
      height: '750px'
    });
    this.setEditDialogData(dialog);
  }

  showDetails(): void {
    this.order.isVisible = !this.order.isVisible;
    this.orderMadeVisible.emit(this.order.id);
  }

}
