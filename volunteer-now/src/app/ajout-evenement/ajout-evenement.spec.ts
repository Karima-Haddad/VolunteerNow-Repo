import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutEvenement } from './ajout-evenement';

describe('AjoutEvenement', () => {
  let component: AjoutEvenement;
  let fixture: ComponentFixture<AjoutEvenement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutEvenement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutEvenement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
