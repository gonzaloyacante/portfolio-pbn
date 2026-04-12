'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import {
  fetchGoogleFonts,
  getFontsByCategory,
  type GoogleFont,
} from '@/lib/google-fonts'
import { logger } from '@/lib/logger'

interface UseGoogleFontPickerOptions {
  value: string
  open: boolean
}

export function useGoogleFontPicker({ value, open }: UseGoogleFontPickerOptions) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [fonts, setFonts] = useState<GoogleFont[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewText, setPreviewText] = useState('The quick brown fox')
  const [visibleCount, setVisibleCount] = useState(20)

  const loadedFontsRef = useRef<Set<string>>(new Set())
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadFonts() {
      setLoading(true)
      setError(null)
      try {
        const fetchedFonts = await fetchGoogleFonts()
        if (fetchedFonts.length === 0) setError('No fonts loaded. Check API Key.')
        setFonts(fetchedFonts)
      } catch (err) {
        logger.error('Failed to load fonts', { error: err })
        setError('Error loading fonts.')
      } finally {
        setLoading(false)
      }
    }
    loadFonts()
  }, [])

  const filteredFonts = useMemo(() => {
    const byCategory = getFontsByCategory(fonts, category)
    if (!search) return byCategory
    const query = search.toLowerCase()
    return byCategory.filter((font) => font.name.toLowerCase().includes(query))
  }, [fonts, search, category])

  useEffect(() => {
    if (!open) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisibleCount((prev) => prev + 20)
      },
      { threshold: 0.5 }
    )
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [open, visibleCount, filteredFonts])

  useEffect(() => {
    setVisibleCount(20)
  }, [search, category, open])

  // Load currently selected font CSS on mount / value change
  useEffect(() => {
    if (!value || loadedFontsRef.current.has(value)) return
    loadedFontsRef.current.add(value)
    const family = value.replace(/ /g, '+')
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [value])

  // Lazy-load visible fonts when modal is open
  useEffect(() => {
    if (!open) return
    const visibleFontNames = filteredFonts
      .slice(0, visibleCount)
      .map((f) => f.name)
      .filter((name) => !loadedFontsRef.current.has(name))
    if (visibleFontNames.length === 0) return
    visibleFontNames.forEach((name) => loadedFontsRef.current.add(name))
    const families = visibleFontNames.map((f) => f.replace(/ /g, '+')).join('&family=')
    if (!families) return
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [open, filteredFonts, visibleCount])

  return {
    search,
    setSearch,
    category,
    setCategory,
    loading,
    error,
    previewText,
    setPreviewText,
    filteredFonts,
    visibleCount,
    loadMoreRef,
  }
}
