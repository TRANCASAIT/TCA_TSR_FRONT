import { TestBed } from '@angular/core/testing';

import { ServicesBackendService } from './services-backend-service.service';

describe('ServicesBackendServiceService', () => {
  let service: ServicesBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
