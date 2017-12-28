import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import {OrderService} from 'app/common/services';

@Component({
  selector: 'app-order-delete-by-date',
  templateUrl: './order-delete-by-date.component.html',
  styleUrls: ['./order-delete-by-date.component.css']
})
export class OrderDeleteByDateComponent implements OnInit {

  public form: FormGroup;
  @Output() ordersDeleted: EventEmitter<boolean> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private orderService: OrderService) {
    this.form = formBuilder.group({
      to: [''],
      from: ['']
    });
  }

  ngOnInit(): void {
  }

  delete(): void {
    this.orderService.deleteByDate(this.form.value).subscribe(() => this.ordersDeleted.emit(true));
  }

}
