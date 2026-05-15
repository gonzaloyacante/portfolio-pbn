'use client'

import { HomeSettingsData } from '@/actions/settings/home'
import { HeroContent } from './HeroContent'

interface HeroSectionProps {
  settings: HomeSettingsData | null
}

/**
 * Public Hero Section
 * Simply wraps the Shared HeroContent
 */
export default function HeroSection({ settings }: HeroSectionProps) {
  return <HeroContent settings={settings} isEditor={false} />
}
