'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import LayoutToastProvider from '@/components/layout/ToastProvider'
import { SWRConfig } from 'swr'
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider'
import CustomThemeProvider from '@/components/layout/ThemeProvider'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const swrConfig = {
  revalidateOnFocus: false,
  dedupingInterval: 2000,
  fetcher: async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`SWR fetch error: ${res.status}`)
    return res.json()
  },
}

interface AppProvidersProps {
  children: React.ReactNode
  themeValues?: Record<string, string>
}

export default function AppProviders({ children, themeValues }: AppProvidersProps) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
      scriptProps={{ async: true, defer: true }}
    >
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <SWRConfig value={swrConfig}>
          <AnalyticsProvider>
            <CustomThemeProvider themeValues={themeValues}>
              {children}
              <LayoutToastProvider />
            </CustomThemeProvider>
          </AnalyticsProvider>
        </SWRConfig>
      </NextThemesProvider>
    </GoogleReCaptchaProvider>
  )
}
