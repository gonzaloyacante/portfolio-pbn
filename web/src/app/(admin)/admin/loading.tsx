export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="relative">
        <div className="text-primary animate-spin text-5xl">⚙️</div>
      </div>
      <p className="text-muted-foreground mt-4 font-sans text-sm font-medium">Cargando panel...</p>
    </div>
  )
}
