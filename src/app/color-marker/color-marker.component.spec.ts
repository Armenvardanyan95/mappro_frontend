import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorMarkerComponent } from './color-marker.component';

describe('ColorMarkerComponent', () => {
  let component: ColorMarkerComponent;
  let fixture: ComponentFixture<ColorMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
