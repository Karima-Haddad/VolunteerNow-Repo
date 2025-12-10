import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInscrit } from './header-inscrit';

describe('HeaderInscrit', () => {
  let component: HeaderInscrit;
  let fixture: ComponentFixture<HeaderInscrit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderInscrit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderInscrit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
