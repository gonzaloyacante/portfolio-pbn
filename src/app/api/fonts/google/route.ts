import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

interface GoogleFontItem {
  family: string
  category: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: string
  files: Record<string, string>
}

interface GoogleFontsResponse {
  kind: string
  items: GoogleFontItem[]
}

/**
 * Fetch fonts from Google Fonts API
 *
 * IMPORTANT: You need a FREE API key from Google Cloud Console
 * 1. Go to: https://console.cloud.google.com/apis/credentials
 * 2. Create a new project (if you don't have one)
 * 3. Enable "Web Fonts Developer API"
 * 4. Create credentials -> API Key
 * 5. Add to .env.local: GOOGLE_FONTS_API_KEY=your_key_here
 *
 * The API key is FREE with generous quotas (no credit card required)
 */
export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_FONTS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Google Fonts API key not configured',
          message:
            'Please add GOOGLE_FONTS_API_KEY to your .env.local file. Get a free key from https://console.cloud.google.com/apis/credentials',
          instructions: [
            '1. Go to https://console.cloud.google.com/apis/credentials',
            '2. Create a project or select existing',
            '3. Enable "Web Fonts Developer API"',
            '4. Create API Key',
            '5. Add to .env.local: GOOGLE_FONTS_API_KEY=your_key_here',
          ],
        },
        { status: 400 }
      )
    }

    const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('Google Fonts API error', { status: response.status, details: errorText })

      return NextResponse.json(
        {
          error: 'Google Fonts API request failed',
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const data: GoogleFontsResponse = await response.json()

    // Transform to our format
    const fonts = data.items.map((font) => ({
      name: font.family,
      category: font.category,
      // Generate Google Fonts URL
      url: `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`,
      variants: font.variants,
    }))

    return NextResponse.json({ fonts, count: fonts.length })
  } catch (error) {
    logger.error('Error fetching Google Fonts:', { error: error })
    return NextResponse.json(
      {
        error: 'Failed to fetch Google Fonts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
