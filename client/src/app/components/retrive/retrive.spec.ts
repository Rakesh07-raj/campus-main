import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Retrive } from './retrive';

describe('Retrive', () => {
  let component: Retrive;
  let fixture: ComponentFixture<Retrive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Retrive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Retrive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
