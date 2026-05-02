import { TestBed } from '@angular/core/testing';

import { StreamChatApi } from './stream-chat-api';

describe('StreamChatApi', () => {
  let service: StreamChatApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreamChatApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
