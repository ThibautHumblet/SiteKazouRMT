import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPlaatsenComponent } from './open-plaatsen.component';

describe('OpenPlaatsenComponent', () => {
  let component: OpenPlaatsenComponent;
  let fixture: ComponentFixture<OpenPlaatsenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenPlaatsenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPlaatsenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
