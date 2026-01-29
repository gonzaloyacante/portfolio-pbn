import { getContacts } from '@/actions/contact.actions'
import ContactList from '@/components/admin/ContactList'
import Link from 'next/link'

export default async function AdminContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-wine dark:text-pink-light text-3xl font-bold">
            Mensajes de Contacto
          </h1>
          <p className="text-wine/60 dark:text-pink-light/60 mt-2">
            Gestiona los mensajes recibidos de los visitantes
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/contacts/settings"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Configurar
          </Link>
          <div className="from-wine to-purple-dark dark:from-pink-hot rounded-2xl bg-gradient-to-r px-6 py-4 text-white shadow-lg dark:to-purple-900">
            <p className="text-xs font-bold tracking-wider uppercase opacity-80">Total</p>
            <p className="text-3xl leading-none font-bold">{contacts.length}</p>
          </div>
        </div>
      </div>

      <ContactList contacts={contacts} />
    </div>
  )
}
