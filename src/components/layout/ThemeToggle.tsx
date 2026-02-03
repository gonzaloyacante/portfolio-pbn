'use client'

import { useSyncExternalStore, useCallback } from 'react'

// Store para manejar el tema
const themeStore = {
  isDark: false,
  listeners: new Set<() => void>(),

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  },

  getSnapshot() {
    return themeStore.isDark
  },

  getServerSnapshot() {
    return false
  },

  toggle() {
    this.isDark = !this.isDark
    if (typeof document !== 'undefined') {
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
    this.listeners.forEach((l) => l())
  },

  init() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.isDark = stored === 'dark' || (!stored && prefersDark)
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      }
    }
  },
}

// Inicializar en cliente
if (typeof window !== 'undefined') {
  themeStore.init()
}

/**
 * Toggle para cambiar entre modo claro y oscuro
 */
export default function ThemeToggle() {
  const isDark = useSyncExternalStore(
    (cb) => themeStore.subscribe(cb),
    () => themeStore.getSnapshot(),
    () => themeStore.getServerSnapshot()
  )

  const toggleTheme = useCallback(() => {
    themeStore.toggle()
  }, [])

  return (
    <button
      onClick={toggleTheme}
      className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      )}
    </button>
  )
}
