import { HttpErrorResponse } from '@angular/common/http';

export function getErrorKey(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const messageKey = typeof error.error?.messageKey === 'string' ? error.error.messageKey : '';
    if (messageKey) {
      return messageKey;
    }

    if (error.status === 0) {
      return 'errors.network';
    }

    if (error.status === 401) {
      return 'errors.sessionExpired';
    }

    if (error.status === 403) {
      return 'errors.forbidden';
    }

    if (error.status === 404) {
      return 'errors.notFound';
    }
  }

  return '';
}

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
  }

  return fallback;
}
