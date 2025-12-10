import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOrganisation } from './profile-organisation';

describe('ProfileOrganisation', () => {
  let component: ProfileOrganisation;
  let fixture: ComponentFixture<ProfileOrganisation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileOrganisation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileOrganisation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
