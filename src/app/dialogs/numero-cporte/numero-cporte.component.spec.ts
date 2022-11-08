import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeroCporteComponent } from './numero-cporte.component';

describe('NumeroCporteComponent', () => {
  let component: NumeroCporteComponent;
  let fixture: ComponentFixture<NumeroCporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumeroCporteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumeroCporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
