import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteInteractive } from './carte-interactive';

describe('CarteInteractive', () => {
  let component: CarteInteractive;
  let fixture: ComponentFixture<CarteInteractive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteInteractive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteInteractive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
