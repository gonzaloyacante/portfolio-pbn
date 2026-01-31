'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ToastProvider } from '@/components/ui'
import { SessionProvider } from 'next-auth/react'
import { SWRConfig } from 'swr'
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider'
import CustomThemeProvider from '@/components/layout/ThemeProvider'

const swrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 2000,
  fetcher: (url: string) => fetch(url).then((res) => res.json()),
}

interface AppProvidersProps {
  children: React.ReactNode
  themeValues?: Record<string, string>
}

export default function AppProviders({ children, themeValues }: AppProvidersProps) {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <SWRConfig value={swrConfig}>
          <ToastProvider>
            <AnalyticsProvider>
              <CustomThemeProvider themeValues={themeValues}>{children}</CustomThemeProvider>
            </AnalyticsProvider>
          </ToastProvider>
        </SWRConfig>
      </NextThemesProvider>
    </SessionProvider>
  )
}
