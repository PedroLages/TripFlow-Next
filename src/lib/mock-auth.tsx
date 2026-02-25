"use client"

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Profile } from '@/types/database'

const MOCK_USERS: Profile[] = [
  { id: '00000000-0000-0000-0000-000000000001', display_name: 'Pedro', avatar_url: 'https://i.pravatar.cc/150?u=pedro', created_at: '' },
  { id: '00000000-0000-0000-0000-000000000002', display_name: 'Sarah J.', avatar_url: 'https://i.pravatar.cc/150?u=sarah', created_at: '' },
  { id: '00000000-0000-0000-0000-000000000003', display_name: 'Alex C.', avatar_url: 'https://i.pravatar.cc/150?u=alex', created_at: '' },
  { id: '00000000-0000-0000-0000-000000000004', display_name: 'Jessica L.', avatar_url: 'https://i.pravatar.cc/150?u=jessica', created_at: '' },
]

interface MockAuthContextValue {
  user: Profile
  availableUsers: Profile[]
  switchUser: (userId: string) => void
}

const MockAuthContext = createContext<MockAuthContextValue | null>(null)

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState(MOCK_USERS[0].id)
  const user = MOCK_USERS.find(u => u.id === currentUserId) ?? MOCK_USERS[0]

  return (
    <MockAuthContext.Provider value={{ user, availableUsers: MOCK_USERS, switchUser: setCurrentUserId }}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const ctx = useContext(MockAuthContext)
  if (!ctx) throw new Error('useMockAuth must be used within MockAuthProvider')
  return ctx
}
