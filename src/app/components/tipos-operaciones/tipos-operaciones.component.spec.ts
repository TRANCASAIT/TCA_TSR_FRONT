import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposOperacionesComponent } from './tipos-operaciones.component';

describe('TiposOperacionesComponent', () => {
  let component: TiposOperacionesComponent;
  let fixture: ComponentFixture<TiposOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposOperacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
