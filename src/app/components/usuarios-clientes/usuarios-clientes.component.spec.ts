import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosClientesComponent } from './usuarios-clientes.component';

describe('UsuariosClientesComponent', () => {
  let component: UsuariosClientesComponent;
  let fixture: ComponentFixture<UsuariosClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
