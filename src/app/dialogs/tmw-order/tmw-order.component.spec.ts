import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmwOrderComponent } from './tmw-order.component';

describe('TmwOrderComponent', () => {
  let component: TmwOrderComponent;
  let fixture: ComponentFixture<TmwOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmwOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmwOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
