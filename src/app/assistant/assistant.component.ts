import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getErrorKey } from '../core/api-error.util';
import { I18nService } from '../i18n.service';
import { AssistantService, ChatTurn } from './assistant.service';

interface DisplayTurn extends ChatTurn {
  id: number;
}

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.css'
})
export class AssistantComponent {
  readonly i18n = inject(I18nService);
  private readonly assistant = inject(AssistantService);

  @ViewChild('messageList') private messageList?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLTextAreaElement>;

  readonly open = signal(false);
  readonly loading = signal(false);
  readonly messages = signal<DisplayTurn[]>([]);
  readonly errorKey = signal('');
  draft = '';
  private nextId = 1;

  toggle(): void {
    this.open.update((value) => !value);
    if (this.open()) {
      setTimeout(() => this.messageInput?.nativeElement.focus());
    }
  }

  close(): void {
    this.open.set(false);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  sendSuggestion(key: string): void {
    this.draft = this.i18n.t(key);
    this.send();
  }

  send(): void {
    const message = this.draft.trim();
    if (!message || this.loading()) {
      return;
    }

    const history = this.messages().slice(-12).map(({ role, content }) => ({ role, content }));
    this.messages.update((items) => [...items, { id: this.nextId++, role: 'user', content: message }]);
    this.draft = '';
    this.errorKey.set('');
    this.loading.set(true);
    this.scrollToBottom();

    this.assistant.reply(message, history, this.i18n.lang()).subscribe({
      next: ({ reply }) => {
        this.messages.update((items) => [...items, { id: this.nextId++, role: 'assistant', content: reply }]);
        this.loading.set(false);
        this.scrollToBottom();
      },
      error: (error) => {
        const key = getErrorKey(error);
        this.errorKey.set(key?.startsWith('chat.') ? key : 'chat.failed');
        this.loading.set(false);
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.messageList?.nativeElement;
      element?.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    });
  }
}
