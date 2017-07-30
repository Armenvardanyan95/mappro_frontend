import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.css']
})
export class FormControlComponent implements OnInit {

  @Input() control: AbstractControl;
  @Input() placeholder: string;
  @Input() submitted: boolean = false;
  @Input() isPassword: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
