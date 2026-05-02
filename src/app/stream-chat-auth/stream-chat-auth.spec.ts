import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamChatAuth } from './stream-chat-auth';

describe('StreamChatAuth', () => {
  let component: StreamChatAuth;
  let fixture: ComponentFixture<StreamChatAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamChatAuth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamChatAuth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
