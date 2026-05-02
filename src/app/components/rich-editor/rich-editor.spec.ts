import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichEditor } from './rich-editor';

describe('RichEditor', () => {
  let component: RichEditor;
  let fixture: ComponentFixture<RichEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RichEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
