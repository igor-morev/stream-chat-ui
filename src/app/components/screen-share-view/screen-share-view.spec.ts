import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenShareView } from './screen-share-view';

describe('ScreenShareView', () => {
  let component: ScreenShareView;
  let fixture: ComponentFixture<ScreenShareView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenShareView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenShareView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
