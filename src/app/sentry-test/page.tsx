'use client'

export default function SentryTestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Sentry Test Page</h1>
      <button
        type="button"
        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        onClick={() => {
          throw new Error('Sentry Test Error: Portfolio PBN')
        }}
      >
        Throw Test Error
      </button>
    </div>
  )
}
