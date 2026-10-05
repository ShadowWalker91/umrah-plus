'use client'

import { createContext, useContext } from 'react'

export type UserRole = 'admin' | 'editor'

type RoleContextValue = {
  role: UserRole
  username: string
}

// Fail-safe default: without a provider the user is treated as an editor
const RoleContext = createContext<RoleContextValue>({ role: 'editor', username: '' })

export function RoleProvider({
  role,
  username,
  children,
}: RoleContextValue & { children: React.ReactNode }) {
  return (
    <RoleContext.Provider value={{ role, username }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
