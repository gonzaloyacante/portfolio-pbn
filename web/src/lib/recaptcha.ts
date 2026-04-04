/**
 * Server-side Google reCAPTCHA v3 verification utility.
 * Minimum passing score: 0.5 (range 0.0–1.0).
 */

interface RecaptchaResponse {
  success: boolean
  score: number
  action: string
  challenge_ts: string
  hostname: string
  'error-codes'?: string[]
}

export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    // In development without keys configured, skip verification
    if (process.env.NODE_ENV === 'development') return true
    return false
  }

  if (!token) return false

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token }).toString(),
    })

    if (!res.ok) return false

    const data = (await res.json()) as RecaptchaResponse
    return data.success && data.score >= 0.5
  } catch {
    return false
  }
}
