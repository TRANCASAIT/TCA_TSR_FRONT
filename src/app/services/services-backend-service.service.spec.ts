import { TestBed } from '@angular/core/testing';

import { ServicesBackendServiceService } from './services-backend-service.service';

describe('ServicesBackendServiceService', () => {
  let service: ServicesBackendServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesBackendServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
