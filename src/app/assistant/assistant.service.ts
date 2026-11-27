import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppLanguage } from '../core/api.models';
import { API_BASE_URL } from '../core/app.constants';

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private readonly http = inject(HttpClient);

  reply(message: string, history: ChatTurn[], language: AppLanguage): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(`${API_BASE_URL}/assistant/chat`, {
      message,
      history,
      language
    });
  }
}
