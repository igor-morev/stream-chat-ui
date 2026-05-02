import { Component, ElementRef, inject, input, ViewChild } from '@angular/core';

/*
  * This component is responsible for rendering a video stream. It takes in a MediaStream and a boolean indicating whether the stream is local or remote. The component will render the video stream accordingly.
  */

@Component({
  selector: 'sc-video-stream-renderer',
  imports: [],
  templateUrl: './video-stream-renderer.html',
  styleUrl: './video-stream-renderer.scss',
})
export class VideoStreamRenderer {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  private elementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

  data = input.required<{ stream: MediaStream; isLocal: boolean, isAudioOn: boolean }>();
  width = input<number>(this.elementRef.nativeElement.offsetWidth || 640);
  height = input<number>(this.elementRef.nativeElement.offsetHeight || 480);

  get videoEl() {
    return this.videoElement.nativeElement;
  }

}
