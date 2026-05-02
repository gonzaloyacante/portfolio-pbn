const LINKS = [
  { id: 'priv-1', label: '1. Información general' },
  { id: 'priv-2', label: '2. ¿Qué datos recopilamos?' },
  { id: 'priv-3', label: '3. ¿Para qué utilizamos sus datos?' },
  { id: 'priv-4', label: '4. Base legal del tratamiento' },
  { id: 'priv-5', label: '5. Conservación de datos' },
  { id: 'priv-6', label: '6. ¿Compartimos datos con terceros?' },
  { id: 'priv-7', label: '7. Sus derechos (ARCO + otros)' },
  { id: 'priv-8', label: '8. Uso de cookies' },
  { id: 'priv-9', label: '9. Geolocalización y ubicación' },
  { id: 'priv-10', label: '10. Seguridad de los datos' },
  { id: 'priv-11', label: '11. Modificaciones de la política' },
  { id: 'priv-12', label: '12. Contacto' },
] as const

export function PrivacyTableOfContents() {
  return (
    <nav
      aria-label="Índice del contenido"
      className="border-border bg-muted/30 mb-10 rounded-2xl border p-4 md:sticky md:top-24"
    >
      <p className="text-foreground mb-3 text-sm font-semibold">En esta página</p>
      <ol className="columns-1 gap-x-8 gap-y-1.5 text-sm sm:columns-2">
        {LINKS.map((item) => (
          <li key={item.id} className="mb-1.5 break-inside-avoid">
            <a
              href={`#${item.id}`}
              className="text-primary underline-offset-2 transition-colors hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
