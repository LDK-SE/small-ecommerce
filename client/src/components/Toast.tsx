import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

type ToastOptions = {
  action?: string;
  duration?: number;
  onAction?: () => void;
};

type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
  action?: string;
  duration: number;
  onAction?: () => void;
};

type ToastListener = (items: ToastItem[]) => void;

let items: ToastItem[] = [];
const listeners = new Set<ToastListener>();
const timers = new Map<string, number>();

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '!',
  warning: '!',
  info: 'i',
  loading: '…'
};

const typeClass: Record<ToastType, string> = {
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400',
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  info: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
  loading: 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
};

function emit() {
  listeners.forEach((listener) => listener(items.slice(0, 3)));
}

function remove(id: string) {
  window.clearTimeout(timers.get(id));
  timers.delete(id);
  items = items.filter((item) => item.id !== id);
  emit();
}

function add(type: ToastType, message: string, options: ToastOptions = {}) {
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const duration = options.duration ?? (type === 'error' ? 5000 : type === 'loading' ? 0 : 3000);
  const item: ToastItem = {
    id,
    type,
    message,
    action: options.action,
    duration,
    onAction: options.onAction
  };

  items = [item, ...items].slice(0, 3);
  emit();

  if (duration > 0) {
    timers.set(id, window.setTimeout(() => remove(id), duration));
  }

  return {
    id,
    close: () => remove(id),
    update(nextType: ToastType, nextMessage: string, nextOptions: ToastOptions = {}) {
      items = items.map((current) =>
        current.id === id
          ? {
              ...current,
              type: nextType,
              message: nextMessage,
              action: nextOptions.action,
              onAction: nextOptions.onAction,
              duration: nextOptions.duration ?? (nextType === 'error' ? 5000 : 3000)
            }
          : current
      );
      emit();
      window.clearTimeout(timers.get(id));
      if (nextType !== 'loading') {
        timers.set(id, window.setTimeout(() => remove(id), nextOptions.duration ?? 3000));
      }
    }
  };
}

export const toast = {
  success: (message: string, options?: ToastOptions) => add('success', message, options),
  error: (message: string, options?: ToastOptions) => add('error', message, options),
  warning: (message: string, options?: ToastOptions) => add('warning', message, options),
  info: (message: string, options?: ToastOptions) => add('info', message, options),
  loading: (message: string, options?: ToastOptions) => add('loading', message, options)
};

export function ToastViewport() {
  const [visibleItems, setVisibleItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.add(setVisibleItems);
    setVisibleItems(items.slice(0, 3));
    return () => {
      listeners.delete(setVisibleItems);
    };
  }, []);

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-4 sm:w-96 sm:translate-x-0"
    >
      {visibleItems.map((item) => (
        <div
          key={item.id}
          role="alert"
          className={`pointer-events-auto animate-[toast-in_260ms_ease-out] rounded-lg border p-3 shadow-lg ${typeClass[item.type]}`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                item.type === 'loading' ? 'animate-spin border border-slate-400 dark:border-slate-600' : 'bg-white/70 dark:bg-slate-700/70'
              }`}
            >
              {icons[item.type]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.message}</p>
              {item.action && (
                <button
                  type="button"
                  onClick={() => {
                    item.onAction?.();
                    remove(item.id);
                  }}
                  className="mt-2 text-sm font-semibold underline"
                >
                  {item.action}
                </button>
              )}
            </div>
            {item.type !== 'loading' && (
              <button
                type="button"
                aria-label="Close notification"
                onClick={() => remove(item.id)}
                className="min-h-6 min-w-6 rounded text-sm font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
}
