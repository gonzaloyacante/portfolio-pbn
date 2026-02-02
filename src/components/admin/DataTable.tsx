interface Column<T> {
  key: string
  header: string
  render: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
}

/**
 * Tabla de datos reutilizable
 */
export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No hay datos',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="border-border bg-muted/30 rounded-2xl border-2 border-dashed p-12 text-center">
        <p className="text-muted-foreground font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-foreground px-6 py-4 text-left text-xs font-bold tracking-wider uppercase"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border bg-card divide-y">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-muted/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="text-foreground px-6 py-4 text-sm">
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
