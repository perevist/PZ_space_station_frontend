import { TestBed } from '@angular/core/testing';

import { ViewRoomsService } from './view-rooms.service';

describe('ViewRoomsService', () => {
  let service: ViewRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
