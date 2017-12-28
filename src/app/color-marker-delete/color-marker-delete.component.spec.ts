import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorMarkerDeleteComponent } from './color-marker-delete.component';

describe('ColorMarkerDeleteComponent', () => {
  let component: ColorMarkerDeleteComponent;
  let fixture: ComponentFixture<ColorMarkerDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorMarkerDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorMarkerDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
