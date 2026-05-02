import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamChatView } from './stream-chat-view';

describe('StreamChatView', () => {
  let component: StreamChatView;
  let fixture: ComponentFixture<StreamChatView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamChatView],
    }).compileComponents();

    fixture = TestBed.createComponent(StreamChatView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
