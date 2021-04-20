import { TestBed } from '@angular/core/testing';

import { WorksitesService } from './worksites.service';

describe('WorksitesService', () => {
  let service: WorksitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorksitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
