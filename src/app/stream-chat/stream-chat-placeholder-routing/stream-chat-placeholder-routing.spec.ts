import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamChatPlaceholderRouting } from './stream-chat-placeholder-routing';

describe('StreamChatPlaceholderRouting', () => {
  let component: StreamChatPlaceholderRouting;
  let fixture: ComponentFixture<StreamChatPlaceholderRouting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamChatPlaceholderRouting],
    }).compileComponents();

    fixture = TestBed.createComponent(StreamChatPlaceholderRouting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
