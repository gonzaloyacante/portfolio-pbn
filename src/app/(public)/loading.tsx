export default function PublicLoading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="relative">
        {/* Logo animado */}
        <div className="animate-pulse text-7xl">💄</div>

        {/* Barra de carga */}
        <div
          className="mt-6 h-1 w-32 overflow-hidden rounded-full"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div
            className="h-full animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full"
            style={{
              backgroundColor: 'var(--color-primary)',
              width: '40%',
            }}
          />
        </div>
      </div>

      <p
        className="mt-4 animate-pulse font-sans text-sm"
        style={{ color: 'var(--color-text)', opacity: 0.6 }}
      >
        Cargando...
      </p>
    </div>
  )
}
