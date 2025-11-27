import { getContacts } from '@/actions/contact.actions'
import ContactList from '@/components/admin/ContactList'

export default async function AdminContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mensajes de Contacto</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Gestiona los mensajes recibidos de los visitantes
          </p>
        </div>

        <div className="bg-wine text-pink-light dark:bg-purple-dark rounded-lg px-4 py-2 shadow-md">
          <p className="text-sm font-medium">Total de mensajes</p>
          <p className="text-2xl font-bold">{contacts.length}</p>
        </div>
      </div>

      <ContactList contacts={contacts} />
    </div>
  )
}
