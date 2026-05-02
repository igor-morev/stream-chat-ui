import { Component, ElementRef, inject, input } from '@angular/core';
import { VideoStreamRenderer } from '@app/components/video-stream-renderer/video-stream-renderer';
@Component({
  selector: 'sc-meeting-view',
  imports: [VideoStreamRenderer],
  templateUrl: './meeting-view.html',
  styleUrl: './meeting-view.scss',
})
export class MeetingView {
  localStream = input.required<MediaStream>();
  isAudioOn = input<boolean>(false);

  remoteStream = input.required<{
    userId: string; stream: MediaStream
  }[]>();

  elementRef = inject(ElementRef)
}
