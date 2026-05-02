import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamChatProfile } from './stream-chat-profile';

describe('StreamChatProfile', () => {
  let component: StreamChatProfile;
  let fixture: ComponentFixture<StreamChatProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamChatProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamChatProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
