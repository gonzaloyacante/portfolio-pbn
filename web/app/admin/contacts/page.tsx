'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Badge, EmptyState, Loading, Input, Select } from '@/components/cms/form-components';
import { Mail, Trash2, Search, CheckCircle, Clock, Reply } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'READ' | 'RESPONDED';
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const data = await apiClient.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function deleteContact(id: string) {
    if (!confirm('¿Eliminar este mensaje?')) return;
    try {
      await apiClient.deleteContact(id);
      loadContacts();
    } catch (error) {
      alert('Error al eliminar');
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      NEW: { variant: 'info' as const, icon: Clock, label: 'Nuevo' },
      READ: { variant: 'warning' as const, icon: Mail, label: 'Leído' },
      RESPONDED: { variant: 'success' as const, icon: CheckCircle, label: 'Respondido' }
    };
    return badges[status as keyof typeof badges] || badges.NEW;
  };

  if (loading) return <Loading text="Cargando mensajes..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mensajes de Contacto</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Revisa y responde los mensajes recibidos
        </p>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            icon={Search}
            placeholder="Buscar por nombre, email o mensaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los estados' },
              { value: 'NEW', label: 'Nuevos' },
              { value: 'READ', label: 'Leídos' },
              { value: 'RESPONDED', label: 'Respondidos' }
            ]}
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {contacts.filter(c => c.status === 'NEW').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nuevos</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Mail className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {contacts.filter(c => c.status === 'READ').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Leídos</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {contacts.filter(c => c.status === 'RESPONDED').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Respondidos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No hay mensajes"
          description={searchQuery ? "No se encontraron mensajes" : "Aún no has recibido mensajes"}
        />
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact) => {
            const statusInfo = getStatusBadge(contact.status);
            const StatusIcon = statusInfo.icon;
            return (
              <Card key={contact.id} padding="lg" className="hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {contact.name}
                        </h3>
                        <Badge variant={statusInfo.variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600 dark:text-gray-300">
                          📧 {contact.email}
                        </p>
                        {contact.phone && (
                          <p className="text-gray-600 dark:text-gray-300">
                            📱 {contact.phone}
                          </p>
                        )}
                        {contact.subject && (
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            Asunto: {contact.subject}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(contact.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="primary" icon={Reply} size="sm">
                      Responder
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
