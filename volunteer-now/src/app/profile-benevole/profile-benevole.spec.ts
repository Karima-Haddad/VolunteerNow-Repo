import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBenevole } from './profile-benevole';

describe('ProfileBenevole', () => {
  let component: ProfileBenevole;
  let fixture: ComponentFixture<ProfileBenevole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileBenevole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileBenevole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
