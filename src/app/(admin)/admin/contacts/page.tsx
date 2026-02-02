import { getContacts } from '@/actions/contact.actions'
import ContactList from '@/components/admin/ContactList'
import Link from 'next/link'

export default async function AdminContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Mensajes de Contacto</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los mensajes recibidos de los visitantes
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/contacts/settings"
            className="border-input hover:bg-accent rounded-lg border px-4 py-2 text-sm font-medium"
          >
            Configurar
          </Link>
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
