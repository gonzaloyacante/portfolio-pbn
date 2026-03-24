import { getContacts } from '@/actions/user/contact'
import ContactList from '@/components/features/contact/ContactList'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

export default async function AdminContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-script text-primary text-4xl">📧 Mensajes de Contacto</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los mensajes recibidos de los visitantes
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={ROUTES.admin.contactSettings}>Configurar</Link>
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
