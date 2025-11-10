// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

// Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// Collect and report Web Vitals
export function reportWebVitals(metric: any) {
  const { name, value, id } = metric
  
  const performanceMetric: PerformanceMetrics = {
    name,
    value,
    rating: getRating(name, value),
    timestamp: Date.now(),
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`📊 Web Vital: ${name}`)
    console.log(`Value: ${value}ms`)
    console.log(`Rating: ${performanceMetric.rating}`)
    console.log(`ID: ${id}`)
    console.groupEnd()
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: send to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        event_label: id,
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      })
    }

    // Example: send to custom analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(performanceMetric),
    }).catch(console.error)
  }
}

// Performance observer for custom metrics
export class CustomPerformanceObserver {
  private observers: PerformanceObserver[] = []

  observeNavigationTiming() {
    if (typeof window === 'undefined') return

    const observer = new window.PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          
          console.group('🚀 Navigation Timing')
          console.log(`DNS Lookup: ${navEntry.domainLookupEnd - navEntry.domainLookupStart}ms`)
          console.log(`TCP Connection: ${navEntry.connectEnd - navEntry.connectStart}ms`)
          console.log(`Request: ${navEntry.responseStart - navEntry.requestStart}ms`)
          console.log(`Response: ${navEntry.responseEnd - navEntry.responseStart}ms`)
          console.log(`DOM Processing: ${navEntry.domContentLoadedEventStart - navEntry.responseEnd}ms`)
          console.log(`Load Complete: ${navEntry.loadEventEnd - navEntry.loadEventStart}ms`)
          console.groupEnd()
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['navigation'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Navigation timing not supported')
    }
  }

  observeResourceTiming() {
    if (typeof window === 'undefined') return

    const observer = new window.PerformanceObserver((list) => {
      const entries = list.getEntries()
      const slowResources = entries.filter((entry) => entry.duration > 1000)
      
      if (slowResources.length > 0) {
        console.group('🐌 Slow Resources (>1s)')
        slowResources.forEach((entry) => {
          console.log(`${entry.name}: ${Math.round(entry.duration)}ms`)
        })
        console.groupEnd()
      }
    })

    try {
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Resource timing not supported')
    }
  }

  observeLongTasks() {
    if (typeof window === 'undefined') return

    const observer = new window.PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        console.warn(`🚨 Long Task detected: ${Math.round(entry.duration)}ms at ${Math.round(entry.startTime)}ms`)
      })
    })

    try {
      observer.observe({ entryTypes: ['longtask'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Long task timing not supported')
    }
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
  }
}

// Image loading optimization
export function optimizeImage(src: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'webp' | 'avif'
} = {}) {
  const { width, height, quality = 80, format = 'auto' } = options
  
  // If using Cloudinary or similar service
  if (src.includes('cloudinary.com')) {
    const params = []
    if (width) params.push(`w_${width}`)
    if (height) params.push(`h_${height}`)
    params.push(`q_${quality}`)
    if (format !== 'auto') params.push(`f_${format}`)
    params.push('c_fill')
    
    return src.replace('/upload/', `/upload/${params.join(',')}/`)
  }
  
  return src
}

// Lazy loading intersection observer
export function createLazyLoadObserver(callback: (element: Element) => void) {
  if (typeof window === 'undefined') return null

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1,
    }
  )

  return observer
}

// Bundle analyzer helper
export function analyzeBundleSize() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return

  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  
  console.group('📦 Bundle Analysis')
  console.log(`Scripts: ${scripts.length}`)
  console.log(`Stylesheets: ${styles.length}`)
  
  // Estimate total bundle size (rough approximation)
  let totalSize = 0
  scripts.forEach((script) => {
    const src = (script as HTMLScriptElement).src
    if (src.includes('/_next/static/')) {
      // Next.js chunks are typically gzipped, estimate size
      totalSize += 50 // KB estimate per chunk
    }
  })
  
  console.log(`Estimated bundle size: ~${totalSize}KB`)
  console.groupEnd()
}
