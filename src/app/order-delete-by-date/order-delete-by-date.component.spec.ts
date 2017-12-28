import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeleteByDateComponent } from './order-delete-by-date.component';

describe('OrderDeleteByDateComponent', () => {
  let component: OrderDeleteByDateComponent;
  let fixture: ComponentFixture<OrderDeleteByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDeleteByDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDeleteByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
