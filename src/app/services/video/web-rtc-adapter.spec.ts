import { TestBed } from '@angular/core/testing';

import { WebRtcAdapter } from './web-rtc-adapter';

describe('WebRtcAdapter', () => {
  let service: WebRtcAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebRtcAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
