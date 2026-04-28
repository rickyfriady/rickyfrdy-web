import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

const toasts = ref<ToastItem[]>([])

function addToast(message: string, type: ToastType = 'info', duration = 4000) {
  const id = Math.random().toString(36).slice(2, 9)
  toasts.value.push({ id, message, type })
  setTimeout(() => dismiss(id), duration)
}

function dismiss(id: string) {
  const i = toasts.value.findIndex((t) => t.id === id)
  if (i > -1) toasts.value.splice(i, 1)
}

export function useToast() {
  return {
    toasts,
    success: (msg: string, duration?: number) => addToast(msg, 'success', duration),
    error: (msg: string, duration?: number) => addToast(msg, 'error', duration),
    info: (msg: string, duration?: number) => addToast(msg, 'info', duration),
    dismiss
  }
}
