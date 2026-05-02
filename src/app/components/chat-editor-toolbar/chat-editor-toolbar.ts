import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sc-chat-editor-toolbar',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './chat-editor-toolbar.html',
  styleUrl: './chat-editor-toolbar.scss',
})
export class ChatEditorToolbar {
  callButtonClicked = output();

  handleCall() {
    this.callButtonClicked.emit();
  }
}
