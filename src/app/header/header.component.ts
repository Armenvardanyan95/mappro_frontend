import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import {MdDialog, MdSnackBar, MdDialogRef} from '@angular/material';
import { LocalStorageService } from 'angular-2-local-storage';

import {ColorMarkerComponent} from  'app/color-marker/color-marker.component';
import {ColorMarkerDeleteComponent} from  'app/color-marker-delete/color-marker-delete.component';
import {OrderService} from 'app/common/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() colors: IColorMarker[];
  @Input() orderIds: number[];
  @Input() showNewOrderForm: boolean = false;
  @Output()
  showNewOrderFormChange: EventEmitter<boolean> = new EventEmitter();
  @Output()
  onArchived: EventEmitter<number[]> = new EventEmitter();
  @Input() archiveMode: boolean = false;
  @Output() canArchivate: EventEmitter<boolean> = new EventEmitter();
  @Output() shouldUpdateOrders: EventEmitter<boolean> = new EventEmitter();
  @Output() shouldUpdateColors: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MdDialog, private orderService: OrderService, private router: Router,
              private snackBar: MdSnackBar, private localStorage: LocalStorageService) { }

  ngOnInit() {
  }

  logout() {
    this.localStorage.clearAll();
    this.router.navigate(['/login']);
  }

  toggleShowNewOrderForm(){
    this.showNewOrderForm = !this.showNewOrderForm;
    this.showNewOrderFormChange.emit(this.showNewOrderForm);
  }

  openNewColorDialog(): void {
    const dialog: MdDialogRef<ColorMarkerComponent> = this.dialog.open(ColorMarkerComponent);
    dialog.componentInstance.colorCreated.subscribe((color: IColorMarker) => {
      this.colors.push(color);
      dialog.close();
      this.shouldUpdateColors.emit(true);
    });
  }

  showDeleteColorDialog(color: IColorMarker): void {
    const dialog: MdDialogRef<ColorMarkerDeleteComponent> = this.dialog.open(ColorMarkerDeleteComponent);
    dialog.componentInstance.colorMarker = color;
    dialog.componentInstance.dialogClosed.subscribe(() => dialog.close());
    dialog.componentInstance.colorDeleted.subscribe(() => {
      dialog.close();
      this.shouldUpdateColors.emit(true);
      this.shouldUpdateOrders.emit(true);
    });
  }

  archive() {
    if (this.archiveMode && this.orderIds.length) {
      this.orderService.archive(this.orderIds)
        .subscribe(
          () => {
            this.onArchived.emit(this.orderIds);
          }
        );
    } else if (!this.orderIds.length && this.archiveMode) {
      this.archiveMode = false;
      this.canArchivate.emit(this.archiveMode);
    } else {
      this.archiveMode = true;
      this.canArchivate.emit(this.archiveMode);
    }
  }

}
