export async function POST(req: Request) {
  try {
    const report = await req.json()
    console.error('[CSP Violation]', JSON.stringify(report))
  } catch {
    // Ignore malformed reports
  }
  return new Response(null, { status: 204 })
}
