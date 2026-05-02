import { InjectionToken } from "@angular/core";

export const CHAT_VIEW_CONTEXT = new InjectionToken<'chat' | 'meeting'>('chat view context', {
  providedIn: 'root',
  factory: () => {
    return 'chat';
  }
})