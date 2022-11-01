import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletesComponent } from './deletes.component';

describe('DeletesComponent', () => {
  let component: DeletesComponent;
  let fixture: ComponentFixture<DeletesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
