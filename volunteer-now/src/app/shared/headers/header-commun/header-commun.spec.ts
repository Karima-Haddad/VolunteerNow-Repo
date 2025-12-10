import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCommun } from './header-commun';

describe('HeaderCommun', () => {
  let component: HeaderCommun;
  let fixture: ComponentFixture<HeaderCommun>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCommun]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCommun);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
