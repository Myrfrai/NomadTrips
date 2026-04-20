import { HttpErrorResponse } from '@angular/common/http';

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const serverMessage =
      typeof error.error?.message === 'string'
        ? error.error.message
        : typeof error.error?.detail === 'string'
          ? error.error.detail
          : '';

    if (serverMessage) {
      return serverMessage;
    }

    if (error.status === 0) {
      return 'Не удалось подключиться к API.';
    }

    if (error.status === 401) {
      return 'Сессия истекла. Войдите снова.';
    }

    if (error.status === 403) {
      return 'Недостаточно прав для выполнения действия.';
    }

    if (error.status === 404) {
      return 'Нужные данные не найдены.';
    }
  }

  return fallback;
}
