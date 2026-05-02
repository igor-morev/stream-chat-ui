import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEditorToolbar } from './chat-editor-toolbar';

describe('ChatEditorToolbar', () => {
  let component: ChatEditorToolbar;
  let fixture: ComponentFixture<ChatEditorToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatEditorToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatEditorToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
