'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { exportContactsToCSV } from '@/actions/user/contact'

export default function ExportContactsButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const csv = await exportContactsToCSV()
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contactos-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      {loading ? 'Exportando…' : '⬇ Exportar CSV'}
    </Button>
  )
}
