import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposUsuariosComponent } from './tipos-usuarios.component';

describe('TiposUsuariosComponent', () => {
  let component: TiposUsuariosComponent;
  let fixture: ComponentFixture<TiposUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
