import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingView } from './meeting-view';

describe('MeetingView', () => {
  let component: MeetingView;
  let fixture: ComponentFixture<MeetingView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
