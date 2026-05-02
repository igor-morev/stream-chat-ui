import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamChat } from './stream-chat';

describe('StreamChat', () => {
  let component: StreamChat;
  let fixture: ComponentFixture<StreamChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamChat],
    }).compileComponents();

    fixture = TestBed.createComponent(StreamChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
