/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AutentiService } from './autenti.service';

describe('Service: Autenti', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutentiService]
    });
  });

  it('should ...', inject([AutentiService], (service: AutentiService) => {
    expect(service).toBeTruthy();
  }));
});
