import { TestBed } from '@angular/core/testing';

import { UserStorageService } from './users-storage.service';

describe('UsersStorageService', () => {
  let service: UserStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
