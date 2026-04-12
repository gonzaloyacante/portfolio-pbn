'use client'

export function MobileInheritNote({ desktopLabel }: { desktopLabel: string }) {
  return (
    <p className="text-muted-foreground mt-1 text-xs italic">
      Heredado de escritorio: {desktopLabel}
    </p>
  )
}

export function MobileResetButton({
  desktopLabel,
  onReset,
}: {
  desktopLabel: string
  onReset: () => void
}) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="text-muted-foreground hover:text-foreground mt-1 text-xs underline"
    >
      Restaurar al valor de escritorio ({desktopLabel})
    </button>
  )
}
