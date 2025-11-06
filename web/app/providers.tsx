"use client";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/swr";
import Header from "@/components/Header";
import StoreInitializer from "@/components/StoreInitializer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import EnvIndicator from "@/components/EnvIndicator";
import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { reportWebVitals, CustomPerformanceObserver } from '@/lib/performance'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    if (typeof window !== 'undefined') {
      // Dynamic import to avoid SSR issues
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(reportWebVitals)
        getFID(reportWebVitals)
        getFCP(reportWebVitals)
        getLCP(reportWebVitals)
        getTTFB(reportWebVitals)
      }).catch(() => {
        // Fallback if web-vitals is not available
        console.warn('Web Vitals library not available')
      })

      // Initialize performance observers
      const observer = new CustomPerformanceObserver()
      observer.observeNavigationTiming()
      observer.observeResourceTiming()
      observer.observeLongTasks()

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SWRConfig value={swrConfig}>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <StoreInitializer />
          <Header />
          {children}
          <ServiceWorkerRegistration />
          <EnvIndicator />
        </div>
      </SWRConfig>
    </ThemeProvider>
  );
}
