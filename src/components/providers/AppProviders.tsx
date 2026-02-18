'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import LayoutToastProvider from '@/components/layout/ToastProvider'
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
          <AnalyticsProvider>
            <CustomThemeProvider themeValues={themeValues}>
              {children}
              <LayoutToastProvider />
            </CustomThemeProvider>
          </AnalyticsProvider>
        </SWRConfig>
      </NextThemesProvider>
    </SessionProvider>
  )
}
