import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';

import {ColorMarkerComponent} from  'app/color-marker/color-marker.component';
import {OrderService} from 'app/common/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() colors: IColorMarker[];
  @Input() orderIds: number[];
  showNewOrderForm: boolean = false;
  @Output()
  showNewOrderFormChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MdDialog, private orderService: OrderService, private snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  toggleShowNewOrderForm(){
    this.showNewOrderForm = !this.showNewOrderForm;
    this.showNewOrderFormChange.emit(this.showNewOrderForm);
  }

  openNewColorDialog(): void {
    const dialog = this.dialog.open(ColorMarkerComponent);
    dialog.componentInstance.colorCreated.subscribe((color: IColorMarker) => {
      this.colors.push(color);
      dialog.close()
    });
  }

  archive() {
    this.orderService.archive(this.orderIds)
      .subscribe(
        () => this.snackBar.open('Orders were succesfully archivated', 'OK')
      );
  }

}
