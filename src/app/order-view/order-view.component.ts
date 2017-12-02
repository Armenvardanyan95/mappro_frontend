import {Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() index: number;
  @Input() colors: IColorMarker[];
  @Input() archiveMode: boolean = false;
  @Output() orderMadeVisible: EventEmitter<IOrder> = new EventEmitter();
  @Output() orderSelected: EventEmitter<number> = new EventEmitter();
  @Output() orderUpdated: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MdDialog) { }

  ngOnInit() {
  }

  private setEditDialogData(dialog: MdDialogRef<OrderEditComponent>): void {
    dialog.componentInstance.colors = this.colors;
    dialog.componentInstance.users = this.users;
    dialog.componentInstance.order = this.order;
    dialog.componentInstance.currentPlace = {lat: this.order.lat, lng: this.order.lng};
  }

  selected() {
    this.orderSelected.emit(this.index);
  }

  openEditDialog(event: Event): void {
    event.preventDefault();
    const dialog: MdDialogRef<OrderEditComponent> = this.dialog.open(OrderEditComponent, <MdDialogConfig>{
      width: '500px',
      height: '850px'
    });
    this.setEditDialogData(dialog);
    dialog.componentInstance.isInPopup = true;
    dialog.componentInstance.orderUpdated.subscribe(() => {
      dialog.close();
      this.orderUpdated.emit(true);
    });
  }

  showDetails(): void {
    this.order.isVisible = !this.order.isVisible;
    this.orderMadeVisible.emit(this.order);
  }

}
