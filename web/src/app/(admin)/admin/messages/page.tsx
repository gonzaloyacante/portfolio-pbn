import { getContacts } from '@/actions/user/contact'
import ContactList from '@/components/features/contact/ContactList'
import ExportContactsButton from '@/components/features/contact/ExportContactsButton'
import { Button } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import { Settings } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

export default async function AdminContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <PageHeader
          title="📧 Mensajes de Contacto"
          description="Gestiona los mensajes recibidos de los visitantes"
        />

        <div className="flex items-center gap-4">
          <ExportContactsButton />
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={ROUTES.admin.contacts}>
              <Settings size={14} />
              Editar info de contacto
            </Link>
          </Button>
          <div className="bg-primary text-primary-foreground rounded-2xl px-6 py-4 shadow-lg">
            <p className="text-xs font-bold tracking-wider uppercase opacity-80">Total</p>
            <p className="text-3xl leading-none font-bold">{contacts.length}</p>
          </div>
        </div>
      </div>

      <ContactList contacts={contacts} />
    </div>
  )
}
