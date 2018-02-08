import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { ColorMarkerService } from 'app/common/services';

@Component({
  selector: 'app-color-marker-delete',
  templateUrl: './color-marker-delete.component.html',
  styleUrls: ['./color-marker-delete.component.css']
})
export class ColorMarkerDeleteComponent implements OnInit {

  colorMarker: IColorMarker;
  confirmed: boolean = false;
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter();
  @Output() colorDeleted: EventEmitter<boolean> = new EventEmitter();

  constructor(private colorMarkerService: ColorMarkerService, private snackbar: MdSnackBar) { }

  ngOnInit() {

  }

  reject() {
    this.dialogClosed.emit(true);
  }

  delete(password: string) {
    this.colorMarkerService.delete({password: password, id: this.colorMarker.id})
      .subscribe(
        res => this.colorDeleted.emit(true),
        err => this.snackbar.open(err.json().message, 'OK')
      );
  }

}
