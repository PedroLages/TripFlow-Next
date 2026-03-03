"use client"

import { useMockAuth } from '@/lib/mock-auth'

export function MockUserSwitcher() {
  const { user, availableUsers, switchUser } = useMockAuth()

  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)' }}>
      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Viewing as:</span>
      <div className="flex gap-1">
        {availableUsers.map((u) => (
          <button
            key={u.id}
            onClick={() => switchUser(u.id)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all"
            style={{
              background: u.id === user.id ? 'var(--accent-primary)' : 'transparent',
              color: u.id === user.id ? 'white' : 'var(--text-secondary)',
            }}
            title={u.display_name}
          >
            <img src={u.avatar_url ?? ''} alt={u.display_name} className="h-5 w-5 rounded-full object-cover" />
            {u.display_name.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  )
}
