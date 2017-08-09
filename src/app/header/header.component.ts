import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {MdDialog} from '@angular/material';

import {ColorMarkerComponent} from  'app/color-marker/color-marker.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() colors: IColorMarker[];
  showNewOrderForm: boolean = false;
  @Output()
  showNewOrderFormChange: EventEmitter<boolean> = new EventEmitter();
  constructor(private dialog: MdDialog) { }

  ngOnInit() {
  }

  toggleShowNewOrderForm(){
    this.showNewOrderForm = !this.showNewOrderForm;
    this.showNewOrderFormChange.emit(this.showNewOrderForm);
  }

  openNewColorDialog(): void {
    const dialog = this.dialog.open(ColorMarkerComponent);
  }

}
