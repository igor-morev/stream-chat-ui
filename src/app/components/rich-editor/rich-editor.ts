import { Component, input } from '@angular/core';

@Component({
  selector: 'sc-rich-editor',
  imports: [],
  templateUrl: './rich-editor.html',
  styleUrl: './rich-editor.scss',
})
export class RichEditor {
  content = input.required<string>();
}
