import { TestBed } from '@angular/core/testing';

import { VideoStreamManager } from './video-stream-manager';

describe('VideoStreamManager', () => {
  let service: VideoStreamManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoStreamManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
