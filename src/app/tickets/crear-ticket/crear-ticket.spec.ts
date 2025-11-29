import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTicket } from './crear-ticket';

describe('CrearTicket', () => {
  let component: CrearTicket;
  let fixture: ComponentFixture<CrearTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTicket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTicket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
