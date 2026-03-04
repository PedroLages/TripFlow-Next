"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'

const ThemeContext = createContext<{ theme: string; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

function getInitialTheme(): string {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('tripflow-theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: string) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.style.colorScheme = theme
  let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  // Browser theme-color meta tag requires literal color values
  meta.content = theme === 'dark' ? '#121212' : '#fcfcfc'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize to undefined to prevent hydration mismatch
  // On client, initialize with actual theme and apply immediately
  const [theme, setTheme] = useState<string | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    const initial = getInitialTheme();
    applyTheme(initial);
    return initial;
  })

  // Apply theme changes and persist to localStorage
  useEffect(() => {
    if (theme && typeof window !== 'undefined') {
      applyTheme(theme)
      localStorage.setItem('tripflow-theme', theme)
    }
  }, [theme])

  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), [])

  // Use 'light' as fallback during SSR to prevent hydration mismatch
  const effectiveTheme = theme ?? 'light'

  return (
    <ThemeContext.Provider value={{ theme: effectiveTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      className="glass-panel theme-toggle-btn"
      onClick={toggle}
      style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer' }}
      title="Toggle Theme"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
