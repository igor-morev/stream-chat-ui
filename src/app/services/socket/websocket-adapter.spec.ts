import { TestBed } from '@angular/core/testing';

import { WebsocketAdapter } from './websocket-adapter';

describe('WebsocketAdapter', () => {
  let service: WebsocketAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
