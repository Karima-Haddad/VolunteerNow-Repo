import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAccueil } from './header-accueil';

describe('HeaderAccueil', () => {
  let component: HeaderAccueil;
  let fixture: ComponentFixture<HeaderAccueil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderAccueil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderAccueil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
