import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEditorControl } from './chat-editor-control';

describe('ChatEditorControl', () => {
  let component: ChatEditorControl;
  let fixture: ComponentFixture<ChatEditorControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatEditorControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatEditorControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
