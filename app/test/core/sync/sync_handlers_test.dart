import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/api_exceptions.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/core/database/app_database.dart';
import 'package:portfolio_pbn/core/sync/sync_handlers.dart';
import 'package:portfolio_pbn/core/sync/sync_queue.dart';

// ── Mocks ─────────────────────────────────────────────────────────────────────

class MockApiClient extends Mock implements ApiClient {}

class MockSyncQueueRepository extends Mock implements SyncQueueRepository {}

// ── Helpers ───────────────────────────────────────────────────────────────────

SyncOperationsTableData _fakeOp({
  String id = 'op-1',
  String operation = 'create',
  String resource = 'categories',
  String? resourceId,
  String payload = '{"title":"Test"}',
}) {
  return SyncOperationsTableData(
    id: id,
    operation: operation,
    resource: resource,
    resourceId: resourceId,
    payload: payload,
    attempts: 0,
    failed: false,
    createdAt: DateTime(2024),
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

void main() {
  late MockApiClient client;
  late SyncHandlerRegistry registry;

  setUp(() {
    client = MockApiClient();
    registry = SyncHandlerRegistry(client);
  });

  // ── SyncHandlerRegistry ─────────────────────────────────────────────────

  group('SyncHandlerRegistry', () {
    test('returns handler for registered resources', () {
      expect(registry.handlerFor('categories'), isNotNull);
      expect(registry.handlerFor('services'), isNotNull);
      expect(registry.handlerFor('testimonials'), isNotNull);
    });

    test('returns null for unregistered resource', () {
      expect(registry.handlerFor('unknown'), isNull);
      expect(registry.handlerFor(''), isNull);
    });
  });

  // ── SyncHandler execution ──────────────────────────────────────────────

  group('SyncHandler — create', () {
    test('sends POST to collection endpoint', () async {
      when(
        () => client.post<dynamic>(
          Endpoints.categories,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async => <String, dynamic>{});

      final handler = registry.handlerFor('categories')!;
      await handler.execute(_fakeOp(operation: 'create'));

      verify(
        () =>
            client.post<dynamic>(Endpoints.categories, data: {'title': 'Test'}),
      ).called(1);
    });
  });

  group('SyncHandler — update', () {
    test('sends PATCH to item endpoint', () async {
      when(
        () => client.patch<dynamic>(
          any<String>(),
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async => <String, dynamic>{});

      final handler = registry.handlerFor('categories')!;
      await handler.execute(
        _fakeOp(
          operation: 'update',
          resourceId: 'proj-42',
          payload: '{"title":"Updated"}',
        ),
      );

      verify(
        () => client.patch<dynamic>(
          Endpoints.category('proj-42'),
          data: {'title': 'Updated'},
        ),
      ).called(1);
    });
  });

  group('SyncHandler — delete', () {
    test('sends DELETE to item endpoint', () async {
      when(
        () => client.delete<dynamic>(any()),
      ).thenAnswer((_) async => <String, dynamic>{});

      final handler = registry.handlerFor('categories')!;
      await handler.execute(
        _fakeOp(operation: 'delete', resourceId: 'proj-99', payload: '{}'),
      );

      verify(
        () => client.delete<dynamic>(Endpoints.category('proj-99')),
      ).called(1);
    });
  });

  // ── Error propagation ──────────────────────────────────────────────────

  group('SyncHandler — error propagation', () {
    test('propagates ConflictException (409)', () {
      when(
        () => client.post<dynamic>(
          Endpoints.categories,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenThrow(const ConflictException());

      final handler = registry.handlerFor('categories')!;
      expect(
        () => handler.execute(_fakeOp(operation: 'create')),
        throwsA(isA<ConflictException>()),
      );
    });

    test('propagates NotFoundException (404)', () {
      when(
        () => client.delete<dynamic>(any<String>()),
      ).thenThrow(const NotFoundException());

      final handler = registry.handlerFor('categories')!;
      expect(
        () => handler.execute(
          _fakeOp(operation: 'delete', resourceId: 'gone', payload: '{}'),
        ),
        throwsA(isA<NotFoundException>()),
      );
    });

    test('propagates NetworkException', () {
      when(
        () => client.post<dynamic>(
          Endpoints.categories,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenThrow(const NetworkException());

      final handler = registry.handlerFor('categories')!;
      expect(
        () => handler.execute(
          _fakeOp(resource: 'categories', operation: 'create'),
        ),
        throwsA(isA<NetworkException>()),
      );
    });
  });

  // ── Different resources ────────────────────────────────────────────────

  group('SyncHandler — categories', () {
    test('uses correct endpoints', () async {
      when(
        () => client.patch<dynamic>(
          any<String>(),
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async => <String, dynamic>{});

      final handler = registry.handlerFor('categories')!;
      await handler.execute(
        _fakeOp(
          resource: 'categories',
          operation: 'update',
          resourceId: 'cat-1',
          payload: '{"name":"New Name"}',
        ),
      );

      verify(
        () => client.patch<dynamic>(
          Endpoints.category('cat-1'),
          data: {'name': 'New Name'},
        ),
      ).called(1);
    });
  });

  group('SyncHandler — services', () {
    test('uses correct endpoints', () async {
      when(
        () => client.delete<dynamic>(any<String>()),
      ).thenAnswer((_) async => <String, dynamic>{});

      final handler = registry.handlerFor('services')!;
      await handler.execute(
        _fakeOp(
          resource: 'services',
          operation: 'delete',
          resourceId: 'svc-1',
          payload: '{}',
        ),
      );

      verify(
        () => client.delete<dynamic>(Endpoints.service('svc-1')),
      ).called(1);
    });
  });
}
