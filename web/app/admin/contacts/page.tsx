'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Eye,
  Trash2,
  Filter,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  X,
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED';
  response?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Selected contact
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Response form
  const [responseText, setResponseText] = useState('');

  // Submitting state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getContacts();
      setContacts(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar contactos');
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (contact: Contact) => {
    setSelectedContact(contact);
    setResponseText(contact.response || '');
    setViewModalOpen(true);

    // Marcar como leído si está en estado NEW
    if (contact.status === 'NEW') {
      try {
        await apiClient.updateContact(contact.id, { status: 'READ' });
        await fetchContacts();
      } catch (err) {
        console.error('Error al marcar como leído:', err);
      }
    }
  };

  const handleUpdateStatus = async (status: Contact['status']) => {
    if (!selectedContact) return;
    try {
      setSubmitting(true);
      setError('');

      const updateData: any = { status };
      
      // Si el status es RESPONDED, incluir el response
      if (status === 'RESPONDED' && responseText) {
        updateData.response = responseText;
      }

      await apiClient.updateContact(selectedContact.id, updateData);
      await fetchContacts();
      
      // Actualizar el contacto seleccionado
      const updated = await apiClient.getContact(selectedContact.id);
      setSelectedContact(updated);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar contacto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    try {
      setSubmitting(true);
      setError('');
      await apiClient.deleteContact(selectedContact.id);
      await fetchContacts();
      setDeleteModalOpen(false);
      setViewModalOpen(false);
      setSelectedContact(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar contacto');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    if (statusFilter !== 'all' && contact.status !== statusFilter) return false;
    return true;
  });

  // Sort by date (most recent first)
  const sortedContacts = [...filteredContacts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
    > = {
      NEW: { label: 'Nuevo', variant: 'destructive' },
      READ: { label: 'Leído', variant: 'secondary' },
      RESPONDED: { label: 'Respondido', variant: 'default' },
      ARCHIVED: { label: 'Archivado', variant: 'outline' },
    };
    const { label, variant } = config[status] || config.NEW;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Contactos</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-muted-foreground">Cargando contactos...</p>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: 'Nuevos',
      count: contacts.filter((c) => c.status === 'NEW').length,
      color: 'text-red-600',
    },
    {
      label: 'Leídos',
      count: contacts.filter((c) => c.status === 'READ').length,
      color: 'text-blue-600',
    },
    {
      label: 'Respondidos',
      count: contacts.filter((c) => c.status === 'RESPONDED').length,
      color: 'text-green-600',
    },
    {
      label: 'Archivados',
      count: contacts.filter((c) => c.status === 'ARCHIVED').length,
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contactos</h1>
          <p className="text-muted-foreground">Gestiona los mensajes de contacto</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label>Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="NEW">Nuevos</SelectItem>
                  <SelectItem value="READ">Leídos</SelectItem>
                  <SelectItem value="RESPONDED">Respondidos</SelectItem>
                  <SelectItem value="ARCHIVED">Archivados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {statusFilter !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter('all')}
                className="mt-7"
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
