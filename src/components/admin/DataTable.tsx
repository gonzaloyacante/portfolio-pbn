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
      <div className="border-wine/20 bg-pink-light/30 dark:border-pink-hot/20 dark:bg-purple-dark/20 rounded-2xl border-2 border-dashed p-12 text-center">
        <p className="text-wine/60 dark:text-pink-light/60 font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="ring-wine/5 dark:bg-purple-dark/20 dark:ring-pink-light/10 overflow-hidden rounded-2xl bg-white shadow-sm ring-1">
      <div className="overflow-x-auto">
        <table className="divide-wine/10 dark:divide-pink-light/10 min-w-full divide-y">
          <thead className="bg-wine/5 dark:bg-pink-light/5">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-wine dark:text-pink-hot px-6 py-4 text-left text-xs font-bold tracking-wider uppercase"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-wine/10 dark:divide-pink-light/10 divide-y bg-white/50 dark:bg-transparent">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-wine/5 dark:hover:bg-pink-light/5 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="text-wine/90 dark:text-pink-light/90 px-6 py-4 text-sm"
                  >
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
