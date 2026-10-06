'use client'

import { AlertTriangle, X } from 'lucide-react'

/**
 * Inline red banner for form/page level errors (e.g. permission denials
 * returned by a server action).
 */
export default function ErrorBanner({
  message,
  onDismiss,
  title = 'Action blocked',
}: {
  message?: string | null
  onDismiss?: () => void
  title?: string
}) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-50 px-4 py-3 text-red-700 shadow-sm"
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-red-500">{title}</p>
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="shrink-0 rounded p-0.5 text-red-400 hover:text-red-700 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
