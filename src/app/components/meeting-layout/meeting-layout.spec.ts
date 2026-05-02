import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingLayout } from './meeting-layout';

describe('MeetingLayout', () => {
  let component: MeetingLayout;
  let fixture: ComponentFixture<MeetingLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
