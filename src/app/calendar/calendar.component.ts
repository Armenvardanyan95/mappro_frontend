import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {MONTHS, TIME_VALUES, DAYS} from 'app/settings';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  months: string[] = MONTHS;
  days: number[] = DAYS;
  calendar: any[];

  constructor() { }

  ngOnInit() {
    this.calendar = this.makeTableData();
    console.log(this.calendar);
  }

  makeTableData() {
    const finalData = [];
    for (const time of TIME_VALUES) {
      const days = {};
      for (let i = 0; i < DAYS.length; i++) {
        days[i + 1] = DAYS[i];
      }
      days['time'] = time;
      finalData.push(days);
    }
    return finalData;
  }

}
