'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

export type ToastKind = 'success' | 'error' | 'info'

type ToastItem = { id: number; kind: ToastKind; message: string }

type ToastApi = { toast: (message: string, kind?: ToastKind) => void }

const ToastContext = createContext<ToastApi>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const STYLES: Record<ToastKind, { wrapper: string; icon: React.ElementType }> = {
  success: {
    wrapper: 'border-emerald-500/40 bg-emerald-50 text-emerald-800',
    icon: CheckCircle2,
  },
  error: {
    wrapper: 'border-red-500/40 bg-red-50 text-red-800',
    icon: AlertTriangle,
  },
  info: {
    wrapper: 'border-amber-500/40 bg-amber-50 text-amber-900',
    icon: Info,
  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const toast = useCallback((message: string, kind: ToastKind = 'info') => {
    if (!message) return
    const id = ++idRef.current
    setItems((prev) => [...prev, { id, kind, message }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, 5000)
  }, [])

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const api = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Toast stack — top right, above the fixed sidebar (z-50) */}
      <div className="fixed top-6 right-6 z-[100] flex w-[min(22rem,calc(100vw-3rem))] flex-col gap-3 pointer-events-none">
        {items.map((item) => {
          const { wrapper, icon: Icon } = STYLES[item.kind]
          return (
            <div
              key={item.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-sm animate-[slideIn_0.25s_ease-out] ${wrapper}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm font-medium leading-snug">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px) translateX(8px); }
          to { opacity: 1; transform: translateY(0) translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
