'use client''use client';



import { useEffect, useState } from 'react'import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/api-client'import { apiClient } from '@/lib/api-client';

import { Mail, Trash2, Loader2, X, Clock, User, MessageSquare } from 'lucide-react'import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';

interface Contact {import { Textarea } from '@/components/ui/textarea';

  id: stringimport {

  name: string  Select,

  email: string  SelectContent,

  message: string  SelectItem,

  createdAt: string  SelectTrigger,

}  SelectValue,

} from '@/components/ui/select';

export default function AdminContactsPage() {import {

  const [contacts, setContacts] = useState<Contact[]>([])  Dialog,

  const [loading, setLoading] = useState(true)  DialogContent,

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)  DialogDescription,

  DialogFooter,

  useEffect(() => {  DialogHeader,

    loadContacts()  DialogTitle,

  }, [])} from '@/components/ui/dialog';

import {

  const loadContacts = async () => {  AlertDialog,

    try {  AlertDialogAction,

      setLoading(true)  AlertDialogCancel,

      const data = await apiClient.getContacts()  AlertDialogContent,

      setContacts(data || [])  AlertDialogDescription,

    } catch (error) {  AlertDialogFooter,

      console.error('Error al cargar mensajes:', error)  AlertDialogHeader,

      alert('Error al cargar los mensajes')  AlertDialogTitle,

    } finally {} from '@/components/ui/alert-dialog';

      setLoading(false)import {

    }  Table,

  }  TableBody,

  TableCell,

  const handleDelete = async (contact: Contact) => {  TableHead,

    if (!confirm(`¿Estás segura de eliminar el mensaje de ${contact.name}?`))  TableHeader,

      return  TableRow,

} from '@/components/ui/table';

    try {import { Badge } from '@/components/ui/badge';

      await apiClient.deleteContact(contact.id)import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

      alert('Mensaje eliminado correctamente')import { Alert, AlertDescription } from '@/components/ui/alert';

      await loadContacts()import {

      if (selectedContact?.id === contact.id) {  Eye,

        setSelectedContact(null)  Trash2,

      }  Filter,

    } catch (error) {  Mail,

      console.error('Error:', error)  Phone,

      alert('Error al eliminar el mensaje')  Calendar,

    }  MessageSquare,

  }  X,

} from 'lucide-react';

  const formatDate = (dateString: string) => {

    const date = new Date(dateString)interface Contact {

    return new Intl.DateTimeFormat('es-ES', {  id: string;

      day: 'numeric',  name: string;

      month: 'long',  email: string;

      year: 'numeric',  phone?: string;

      hour: '2-digit',  message: string;

      minute: '2-digit',  status: 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED';

    }).format(date)  response?: string;

  }  respondedAt?: string;

  createdAt: string;

  if (loading) {  updatedAt: string;

    return (}

      <div className="flex items-center justify-center min-h-screen">

        <div className="text-center">export default function AdminContactsPage() {

          <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500" />  const [contacts, setContacts] = useState<Contact[]>([]);

          <p className="mt-4 text-slate-600">Cargando mensajes...</p>  const [loading, setLoading] = useState(true);

        </div>  const [error, setError] = useState('');

      </div>

    )  // Filter

  }  const [statusFilter, setStatusFilter] = useState<string>('all');



  return (  // Modals

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">  const [viewModalOpen, setViewModalOpen] = useState(false);

      <div className="max-w-6xl mx-auto">  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

        {/* Header */}

        <div className="mb-8">  // Selected contact

          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

            Mensajes Recibidos

          </h1>  // Response form

          <p className="text-slate-600 mt-2">  const [responseText, setResponseText] = useState('');

            Consultas y mensajes de tus visitantes

          </p>  // Submitting state

        </div>  const [submitting, setSubmitting] = useState(false);



        {/* Stats */}  useEffect(() => {

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">    fetchContacts();

          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">  }, []);

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">  const fetchContacts = async () => {

                <Mail className="w-6 h-6 text-rose-600" />    try {

              </div>      setLoading(true);

              <div>      const data = await apiClient.getContacts();

                <p className="text-2xl font-bold text-slate-800">      setContacts(data || []);

                  {contacts.length}    } catch (err: any) {

                </p>      setError(err.message || 'Error al cargar contactos');

                <p className="text-sm text-slate-500">Total de Mensajes</p>    } finally {

              </div>      setLoading(false);

            </div>    }

          </div>  };



          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">  const handleViewContact = async (contact: Contact) => {

            <div className="flex items-center gap-4">    setSelectedContact(contact);

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">    setResponseText(contact.response || '');

                <MessageSquare className="w-6 h-6 text-emerald-600" />    setViewModalOpen(true);

              </div>

              <div>    // Marcar como leído si está en estado NEW

                <p className="text-2xl font-bold text-slate-800">    if (contact.status === 'NEW') {

                  {contacts.filter((c) => {      try {

                    const daysDiff = Math.floor(        await apiClient.updateContact(contact.id, { status: 'READ' });

                      (Date.now() - new Date(c.createdAt).getTime()) /        await fetchContacts();

                        (1000 * 60 * 60 * 24)      } catch (err) {

                    )        console.error('Error al marcar como leído:', err);

                    return daysDiff <= 7      }

                  }).length}    }

                </p>  };

                <p className="text-sm text-slate-500">Esta Semana</p>

              </div>  const handleUpdateStatus = async (status: Contact['status']) => {

            </div>    if (!selectedContact) return;

          </div>    try {

      setSubmitting(true);

          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">      setError('');

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">      const updateData: any = { status };

                <User className="w-6 h-6 text-blue-600" />      

              </div>      // Si el status es RESPONDED, incluir el response

              <div>      if (status === 'RESPONDED' && responseText) {

                <p className="text-2xl font-bold text-slate-800">        updateData.response = responseText;

                  {new Set(contacts.map((c) => c.email)).size}      }

                </p>

                <p className="text-sm text-slate-500">Personas Únicas</p>      await apiClient.updateContact(selectedContact.id, updateData);

              </div>      await fetchContacts();

            </div>      

          </div>      // Actualizar el contacto seleccionado

        </div>      const updated = await apiClient.getContact(selectedContact.id);

      setSelectedContact(updated);

        {/* Messages List */}    } catch (err: any) {

        {contacts.length === 0 ? (      setError(err.message || 'Error al actualizar contacto');

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">    } finally {

            <Mail className="w-16 h-16 mx-auto text-slate-300 mb-4" />      setSubmitting(false);

            <h3 className="text-xl font-semibold text-slate-700 mb-2">    }

              No hay mensajes todavía  };

            </h3>

            <p className="text-slate-500">  const handleDeleteContact = async () => {

              Los mensajes de tu formulario de contacto aparecerán aquí    if (!selectedContact) return;

            </p>    try {

          </div>      setSubmitting(true);

        ) : (      setError('');

          <div className="space-y-4">      await apiClient.deleteContact(selectedContact.id);

            {contacts.map((contact) => (      await fetchContacts();

              <div      setDeleteModalOpen(false);

                key={contact.id}      setViewModalOpen(false);

                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all cursor-pointer"      setSelectedContact(null);

                onClick={() => setSelectedContact(contact)}    } catch (err: any) {

              >      setError(err.message || 'Error al eliminar contacto');

                <div className="flex items-start justify-between gap-4">    } finally {

                  {/* Content */}      setSubmitting(false);

                  <div className="flex-1 min-w-0">    }

                    <div className="flex items-center gap-3 mb-2">  };

                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center flex-shrink-0">

                        <span className="text-lg font-bold text-rose-600">  const openDeleteModal = (contact: Contact) => {

                          {contact.name.charAt(0).toUpperCase()}    setSelectedContact(contact);

                        </span>    setDeleteModalOpen(true);

                      </div>  };

                      <div className="flex-1 min-w-0">

                        <h3 className="text-lg font-bold text-slate-800 truncate">  // Filter contacts

                          {contact.name}  const filteredContacts = contacts.filter((contact) => {

                        </h3>    if (statusFilter !== 'all' && contact.status !== statusFilter) return false;

                        <p className="text-sm text-slate-500 truncate">    return true;

                          {contact.email}  });

                        </p>

                      </div>  // Sort by date (most recent first)

                    </div>  const sortedContacts = [...filteredContacts].sort(

    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

                    <p className="text-slate-600 line-clamp-2 mb-3">  );

                      {contact.message}

                    </p>  const getStatusBadge = (status: string) => {

    const config: Record<

                    <div className="flex items-center gap-2 text-xs text-slate-400">      string,

                      <Clock className="w-3 h-3" />      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }

                      {formatDate(contact.createdAt)}    > = {

                    </div>      NEW: { label: 'Nuevo', variant: 'destructive' },

                  </div>      READ: { label: 'Leído', variant: 'secondary' },

      RESPONDED: { label: 'Respondido', variant: 'default' },

                  {/* Delete Button */}      ARCHIVED: { label: 'Archivado', variant: 'outline' },

                  <button    };

                    onClick={(e) => {    const { label, variant } = config[status] || config.NEW;

                      e.stopPropagation()    return <Badge variant={variant}>{label}</Badge>;

                      handleDelete(contact)  };

                    }}

                    className="p-2 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"  const formatDate = (dateString: string) => {

                  >    return new Date(dateString).toLocaleDateString('es-ES', {

                    <Trash2 className="w-4 h-4" />      day: '2-digit',

                  </button>      month: 'short',

                </div>      year: 'numeric',

              </div>      hour: '2-digit',

            ))}      minute: '2-digit',

          </div>    });

        )}  };



        {/* Info Card */}  if (loading) {

        <div className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-200 p-6">    return (

          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">      <div className="space-y-4">

            💡 Consejos        <h1 className="text-3xl font-bold">Contactos</h1>

          </h4>        <div className="flex items-center justify-center h-64">

          <ul className="text-sm text-slate-600 space-y-2">          <div className="text-center">

            <li>            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />

              • Responde a los mensajes directamente desde tu correo            <p className="mt-2 text-sm text-muted-foreground">Cargando contactos...</p>

              electrónico          </div>

            </li>        </div>

            <li>      </div>

              • Los mensajes se almacenan aquí para que puedas consultarlos    );

              cuando quieras  }

            </li>

            <li>• Haz clic en un mensaje para ver todos los detalles</li>  const statsCards = [

          </ul>    {

        </div>      label: 'Nuevos',

      </div>      count: contacts.filter((c) => c.status === 'NEW').length,

      color: 'text-red-600',

      {/* Modal para ver mensaje completo */}    },

      {selectedContact && (    {

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">      label: 'Leídos',

          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">      count: contacts.filter((c) => c.status === 'READ').length,

            {/* Modal Header */}      color: 'text-blue-600',

            <div className="p-6 border-b border-slate-100">    },

              <div className="flex items-center justify-between">    {

                <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">      label: 'Respondidos',

                  Mensaje de {selectedContact.name}      count: contacts.filter((c) => c.status === 'RESPONDED').length,

                </h2>      color: 'text-green-600',

                <button    },

                  onClick={() => setSelectedContact(null)}    {

                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"      label: 'Archivados',

                >      count: contacts.filter((c) => c.status === 'ARCHIVED').length,

                  <X className="w-5 h-5 text-slate-400" />      color: 'text-gray-600',

                </button>    },

              </div>  ];

            </div>

  return (

            {/* Modal Body */}    <div className="space-y-6">

            <div className="p-6 space-y-6">      {/* Header */}

              {/* Sender Info */}      <div className="flex items-center justify-between">

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">        <div>

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center flex-shrink-0">          <h1 className="text-3xl font-bold">Contactos</h1>

                  <span className="text-xl font-bold text-rose-600">          <p className="text-muted-foreground">Gestiona los mensajes de contacto</p>

                    {selectedContact.name.charAt(0).toUpperCase()}        </div>

                  </span>      </div>

                </div>

                <div>      {/* Error Alert */}

                  <h3 className="font-bold text-slate-800">      {error && (

                    {selectedContact.name}        <Alert variant="destructive">

                  </h3>          <AlertDescription>{error}</AlertDescription>

                  <a        </Alert>

                    href={`mailto:${selectedContact.email}`}      )}

                    className="text-sm text-rose-600 hover:underline"

                  >      {/* Stats */}

                    {selectedContact.email}      <div className="grid gap-4 md:grid-cols-4">

                  </a>        {statsCards.map((stat) => (

                </div>          <Card key={stat.label}>

              </div>            <CardContent className="p-4">

              <div className="flex items-center justify-between">

              {/* Date */}                <div>

              <div className="flex items-center gap-2 text-sm text-slate-500">                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>

                <Clock className="w-4 h-4" />                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>

                Recibido el {formatDate(selectedContact.createdAt)}                </div>

              </div>              </div>

            </CardContent>

              {/* Message */}          </Card>

              <div>        ))}

                <h4 className="font-semibold text-slate-700 mb-3">Mensaje:</h4>      </div>

                <div className="p-4 bg-slate-50 rounded-xl">

                  <p className="text-slate-700 whitespace-pre-wrap">      {/* Filters */}

                    {selectedContact.message}      <Card>

                  </p>        <CardHeader>

                </div>          <CardTitle className="text-lg flex items-center gap-2">

              </div>            <Filter className="h-5 w-5" />

            Filtros

              {/* Actions */}          </CardTitle>

              <div className="flex gap-3">        </CardHeader>

                <a        <CardContent>

                  href={`mailto:${selectedContact.email}?subject=Re: Tu mensaje en mi portfolio`}          <div className="flex items-center gap-4">

                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"            <div className="flex-1 space-y-2">

                >              <Label>Estado</Label>

                  <Mail className="w-5 h-5" />              <Select value={statusFilter} onValueChange={setStatusFilter}>

                  Responder por Email                <SelectTrigger>

                </a>                  <SelectValue />

                <button                </SelectTrigger>

                  onClick={() => {                <SelectContent>

                    handleDelete(selectedContact)                  <SelectItem value="all">Todos</SelectItem>

                    setSelectedContact(null)                  <SelectItem value="NEW">Nuevos</SelectItem>

                  }}                  <SelectItem value="READ">Leídos</SelectItem>

                  className="h-12 px-6 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"                  <SelectItem value="RESPONDED">Respondidos</SelectItem>

                >                  <SelectItem value="ARCHIVED">Archivados</SelectItem>

                  <Trash2 className="w-5 h-5" />                </SelectContent>

                </button>              </Select>

              </div>            </div>

            </div>

          </div>            {statusFilter !== 'all' && (

        </div>              <Button

      )}                variant="outline"

    </div>                size="sm"

  )                onClick={() => setStatusFilter('all')}

}                className="mt-7"

              >
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron contactos
                  </TableCell>
                </TableRow>
              ) : (
                sortedContacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className={contact.status === 'NEW' ? 'bg-red-50 dark:bg-red-950/10' : ''}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {contact.status === 'NEW' && (
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                        )}
                        {contact.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      {contact.phone ? (
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(contact.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewContact(contact)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(contact)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View/Respond Modal */}
      <Dialog
        open={viewModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setViewModalOpen(false);
            setSelectedContact(null);
            setResponseText('');
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Contacto</DialogTitle>
            <DialogDescription>
              Información y gestión del mensaje de contacto
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Información de Contacto</span>
                    {getStatusBadge(selectedContact.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Nombre</Label>
                    <p className="font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Teléfono</Label>
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {selectedContact.phone}
                      </a>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-muted-foreground">Fecha de recepción</Label>
                    <p className="text-sm">{formatDate(selectedContact.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Mensaje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                </CardContent>
              </Card>

              {/* Response */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Respuesta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Escribe tu respuesta aquí (opcional)..."
                    rows={4}
                  />
                  {selectedContact.respondedAt && (
                    <p className="text-xs text-muted-foreground">
                      Respondido el {formatDate(selectedContact.respondedAt)}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Status Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cambiar Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus('READ')}
                      disabled={submitting || selectedContact.status === 'READ'}
                    >
                      Marcar como Leído
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus('RESPONDED')}
                      disabled={submitting || selectedContact.status === 'RESPONDED'}
                    >
                      Marcar como Respondido
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus('ARCHIVED')}
                      disabled={submitting || selectedContact.status === 'ARCHIVED'}
                    >
                      Archivar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewModalOpen(false);
                setSelectedContact(null);
                setResponseText('');
              }}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el mensaje de "
              {selectedContact?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContact}
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
