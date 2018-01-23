import { Component, OnInit, EventEmitter } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import {ColorMarkerService} from 'app/common/services';

@Component({
  selector: 'app-color-marker',
  templateUrl: './color-marker.component.html',
  styleUrls: ['./color-marker.component.css']
})
export class ColorMarkerComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;
  public color: string = "#127bdc";
  public colorCreated: EventEmitter<IColorMarker> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private colorMarkerService: ColorMarkerService,
              private snackbar: MatSnackBar) {
    this.form = formBuilder.group({
      'name': ['', Validators.required],
      'color': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  setColor(color: string): void {
    this.color = color;
    this.form.controls['color'].setValue(color);
  }

  onSubmit(values: IColorMarker): void {
    this.submitted = true;
    if (this.form.valid) {
      this.colorMarkerService.create(values).subscribe(
        (color: IColorMarker) => {
          this.colorCreated.emit(color);
        },
            err => this.snackbar.open('Something went wrong', 'OK')
      );
    }
  }

}
