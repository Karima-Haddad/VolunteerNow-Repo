import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionOrganisationComponent } from './inscription-organisation';

describe('InscriptionOrganisation', () => {
  let component: InscriptionOrganisationComponent
  let fixture: ComponentFixture<InscriptionOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionOrganisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
