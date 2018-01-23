import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { OrderService } from 'app/common/services';

@Component({
  selector: 'app-order-delete',
  templateUrl: './order-delete.component.html',
  styleUrls: ['./order-delete.component.css']
})
export class OrderDeleteComponent implements OnInit {

  orders: number[];
  confirmed: boolean = false;
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter();
  @Output() colorDeleted: EventEmitter<boolean> = new EventEmitter();

  constructor(private orderService: OrderService, private snackbar: MatSnackBar) { }

  ngOnInit() {

  }

  reject() {
    this.dialogClosed.emit(true);
  }

  delete(password: string) {
    this.orderService.delete({password: password, ids: this.orders})
      .subscribe(
        res => this.colorDeleted.emit(true),
        err => this.snackbar.open(err.json().message, 'OK')
      );
  }

}
