import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'sc-meeting-toolbar',
  imports: [MatIcon, MatButtonModule],
  templateUrl: './meeting-toolbar.html',
  styleUrl: './meeting-toolbar.scss',
})
export class MeetingToolbar {
  isChatOn = input<boolean>();
  isAudioOn = input(false);
  isCameraOn = input(true);

  toggleChatClicked = output();
  leaveButtonClicked = output();
  toggleCameraClicked = output();
  toggleAudioClicked = output();

  handleToggleChat() {
    this.toggleChatClicked.emit();
  }

  handleLeave() {
    this.leaveButtonClicked.emit();
  }

  handleToggleCamera() {
    this.toggleCameraClicked.emit();
  }

  handleToggleAudio() {
    this.toggleAudioClicked.emit();
  }
}
