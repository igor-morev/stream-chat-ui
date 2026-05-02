import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUserView } from './chat-user-view';

describe('ChatUserView', () => {
  let component: ChatUserView;
  let fixture: ComponentFixture<ChatUserView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatUserView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatUserView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
