import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoStreamRenderer } from './video-stream-renderer';

describe('VideoStreamRenderer', () => {
  let component: VideoStreamRenderer;
  let fixture: ComponentFixture<VideoStreamRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoStreamRenderer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoStreamRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
