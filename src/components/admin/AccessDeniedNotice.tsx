'use client'

import { useEffect } from 'react'
import ErrorBanner from '@/components/admin/ErrorBanner'
import { useToast } from '@/components/admin/ToastProvider'

/**
 * Shown after the middleware bounced an editor away from an admin-only route
 * (create/new pages, user management). Renders the inline banner and pops a
 * toast so the block is never silent.
 */
export default function AccessDeniedNotice({ message }: { message: string }) {
  const { toast } = useToast()

  useEffect(() => {
    toast(message, 'error')
    // toast identity is stable (useCallback), so this fires once per message
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])

  return <ErrorBanner message={message} title="Access denied" />
}
