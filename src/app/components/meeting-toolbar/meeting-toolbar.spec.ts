import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingToolbar } from './meeting-toolbar';

describe('MeetingToolbar', () => {
  let component: MeetingToolbar;
  let fixture: ComponentFixture<MeetingToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
