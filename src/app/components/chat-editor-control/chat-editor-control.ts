import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sc-chat-editor-control',
  imports: [MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './chat-editor-control.html',
  styleUrl: './chat-editor-control.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ChatEditorControl,
      multi: true,
    },
  ],
})
export class ChatEditorControl implements ControlValueAccessor {
  formControl = new FormControl('', Validators.required);
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  submitEvent = output<string>();

  constructor() {
    this.formControl.valueChanges.subscribe(value => {
      this.onChange(value);
    });
  }

  sendMessage() {
    const value = this.formControl.value?.trim();

    if (this.formControl.valid && value) {
      this.submitEvent.emit(value);
      this.formControl.reset();
    }
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }
}