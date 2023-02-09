import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioClienteComponent } from './usuario-cliente.component';

describe('UsuarioClienteComponent', () => {
  let component: UsuarioClienteComponent;
  let fixture: ComponentFixture<UsuarioClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
