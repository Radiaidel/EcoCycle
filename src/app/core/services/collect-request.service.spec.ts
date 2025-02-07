import { TestBed } from '@angular/core/testing';
import { CollectRequestService } from './collect-request.service';


describe('CollectRequestService', () => {
  let service: CollectRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
