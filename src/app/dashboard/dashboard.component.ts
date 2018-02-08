import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { MenuItem } from 'primeng/primeng';
import { LocalStorageService } from 'angular-2-local-storage';

import { OrderService, ColorMarkerService } from 'app/common/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public dates: {date: any, orders: IOrder[]}[] = [];
  public colors: IColorMarker[] = [];
  public items: MenuItem[] = [];
  public date: Date;

  constructor(private orderService: OrderService, private colorMarkerService: ColorMarkerService,
              private snackbar: MdSnackBar, private router: Router,
              private localStorage: LocalStorageService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        const id: number = params['id'];
        this.orderService.filterUserOrders(id).subscribe((res) => this.dates = res);
      } else {
        this.orderService.filterMyOrders().subscribe((res) => this.dates = res);
      }
    });
    this.colorMarkerService.all().subscribe((res: IColorMarker[]) => this.colors = res);
  }

  changeOrderColor(order: IOrder): void {
    this.orderService.changeOrderColor(order.id, order.colorMarkerDetails.id)
      .subscribe(() => {
        order.colorMarkerDetails.color = this.colors
          .filter((color: IColorMarker) => color.id === order.colorMarkerDetails.id)
          .map((color: IColorMarker) => color.color)[0];
      });
  }

  logout() {
    this.localStorage.clearAll();
    this.router.navigate(['/login']);
  }

  public makeRGBWithAlpha(hex: string): string {
    const rgb = this.hexToRgb(hex);
    const rgbString = `rgba(${rgb.r},${rgb.g},${rgb.b},0.5)`;
    return rgbString;
  }

  private hexToRgb(hex: string) {
    const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  filterByDate(): void {
    this.orderService.filterMyOrdersByDate(this.date)
      .subscribe((res) => this.dates = res);
  }

}
