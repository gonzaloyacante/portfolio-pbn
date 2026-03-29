import 'dart:convert';

import '../api/api_client.dart';
import '../api/endpoints.dart';
import '../database/app_database.dart';
import '../utils/app_logger.dart';

// ── SyncHandler ───────────────────────────────────────────────────────────────

/// Contrato que cada handler de recurso debe implementar.
///
/// Un handler transforma una [SyncOperationsTableData] en una llamada HTTP.
abstract class SyncHandler {
  const SyncHandler();

  /// Procesa una operación pendiente para este recurso.
  ///
  /// Lanza una excepción si la operación falla y debe reintentarse.
  Future<void> execute(SyncOperationsTableData operation);
}

// ── _ResourceSyncHandler ──────────────────────────────────────────────────────

/// Handler genérico para recursos REST estándar (CRUD).
///
/// Admite las operaciones: create → POST, update → PATCH, delete → DELETE.
class _ResourceSyncHandler extends SyncHandler {
  const _ResourceSyncHandler({
    required this.name,
    required this.client,
    required this.collectionPath,
    required this.itemPath,
  });

  final String name;
  final ApiClient client;

  /// Path de la colección, ej. `/api/admin/projects`
  final String collectionPath;

  /// Función que devuelve el path de un ítem a partir de su id.
  final String Function(String id) itemPath;

  @override
  Future<void> execute(SyncOperationsTableData op) async {
    final payload = jsonDecode(op.payload) as Map<String, dynamic>;
    AppLogger.info('$name SyncHandler: ${op.operation} [${op.id}]');

    switch (op.operation) {
      case 'create':
        await client.post<dynamic>(collectionPath, data: payload);
      case 'update':
        final id = op.resourceId ?? '';
        await client.patch<dynamic>(itemPath(id), data: payload);
      case 'delete':
        final id = op.resourceId ?? '';
        await client.delete<dynamic>(itemPath(id));
      default:
        AppLogger.warn('$name SyncHandler: unknown operation ${op.operation}');
    }
  }
}

// ── _TrashSyncHandler ─────────────────────────────────────────────────────────

/// Handler especial para la papelera, cuyos endpoints son
/// `/api/admin/trash/{type}/{id}` (non-standard path pattern).
///
/// El payload debe contener `{"type": "project"|"category"|...}`.
class _TrashSyncHandler extends SyncHandler {
  const _TrashSyncHandler({required this.client});

  final ApiClient client;

  @override
  Future<void> execute(SyncOperationsTableData op) async {
    final payload = jsonDecode(op.payload) as Map<String, dynamic>;
    final type = payload['type'] as String? ?? '';
    final id = op.resourceId ?? '';
    AppLogger.info('TrashSyncHandler: ${op.operation} [$type/$id]');

    switch (op.operation) {
      case 'update': // restore
        await client.patch<dynamic>(Endpoints.trashTypedItem(type, id));
      case 'delete': // purge
        await client.delete<dynamic>(Endpoints.trashTypedItem(type, id));
      default:
        AppLogger.warn('TrashSyncHandler: unknown operation ${op.operation}');
    }
  }
}

// ── SyncHandlerRegistry ───────────────────────────────────────────────────────

/// Registro central de handlers por nombre de recurso.
///
/// Añadir una entrada aquí activa la sincronización offline para ese recurso.
class SyncHandlerRegistry {
  SyncHandlerRegistry(ApiClient client)
    : _handlers = {
        'projects': _ResourceSyncHandler(
          name: 'Project',
          client: client,
          collectionPath: Endpoints.projects,
          itemPath: Endpoints.project,
        ),
        'categories': _ResourceSyncHandler(
          name: 'Category',
          client: client,
          collectionPath: Endpoints.categories,
          itemPath: Endpoints.category,
        ),
        'services': _ResourceSyncHandler(
          name: 'Service',
          client: client,
          collectionPath: Endpoints.services,
          itemPath: Endpoints.service,
        ),
        'testimonials': _ResourceSyncHandler(
          name: 'Testimonial',
          client: client,
          collectionPath: Endpoints.testimonials,
          itemPath: Endpoints.testimonial,
        ),
        'contacts': _ResourceSyncHandler(
          name: 'Contact',
          // Contacts are never created from admin side, only updated/deleted.
          client: client,
          collectionPath: Endpoints.contacts,
          itemPath: Endpoints.contact,
        ),
        'bookings': _ResourceSyncHandler(
          name: 'Booking',
          client: client,
          collectionPath: Endpoints.bookings,
          itemPath: Endpoints.booking,
        ),
        'trash': _TrashSyncHandler(client: client),
      };

  final Map<String, SyncHandler> _handlers;

  /// Devuelve el handler para [resource], o null si no está registrado.
  SyncHandler? handlerFor(String resource) => _handlers[resource];
}
