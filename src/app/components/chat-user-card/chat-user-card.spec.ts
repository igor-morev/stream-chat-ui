import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUserCard } from './chat-user-card';

describe('ChatUserCard', () => {
  let component: ChatUserCard;
  let fixture: ComponentFixture<ChatUserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatUserCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatUserCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
