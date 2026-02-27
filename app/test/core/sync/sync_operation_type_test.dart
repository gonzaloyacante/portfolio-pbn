import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/sync/sync_queue.dart';

void main() {
  group('SyncOperationType — values', () {
    test(
      'has exactly 4 values',
      () => expect(SyncOperationType.values.length, 4),
    );
    test(
      'contains create',
      () =>
          expect(SyncOperationType.values, contains(SyncOperationType.create)),
    );
    test(
      'contains update',
      () =>
          expect(SyncOperationType.values, contains(SyncOperationType.update)),
    );
    test(
      'contains delete',
      () =>
          expect(SyncOperationType.values, contains(SyncOperationType.delete)),
    );
    test(
      'contains upload',
      () =>
          expect(SyncOperationType.values, contains(SyncOperationType.upload)),
    );
  });

  group('SyncOperationType — names', () {
    test(
      'create.name == "create"',
      () => expect(SyncOperationType.create.name, 'create'),
    );
    test(
      'update.name == "update"',
      () => expect(SyncOperationType.update.name, 'update'),
    );
    test(
      'delete.name == "delete"',
      () => expect(SyncOperationType.delete.name, 'delete'),
    );
    test(
      'upload.name == "upload"',
      () => expect(SyncOperationType.upload.name, 'upload'),
    );
  });

  group('SyncOperationType — index', () {
    test('create has index 0', () => expect(SyncOperationType.create.index, 0));
    test('update has index 1', () => expect(SyncOperationType.update.index, 1));
    test('delete has index 2', () => expect(SyncOperationType.delete.index, 2));
    test('upload has index 3', () => expect(SyncOperationType.upload.index, 3));
  });

  group('SyncOperationType — toString', () {
    test(
      'create.toString contains "create"',
      () => expect(SyncOperationType.create.toString(), contains('create')),
    );
    test(
      'update.toString contains "update"',
      () => expect(SyncOperationType.update.toString(), contains('update')),
    );
    test(
      'delete.toString contains "delete"',
      () => expect(SyncOperationType.delete.toString(), contains('delete')),
    );
    test(
      'upload.toString contains "upload"',
      () => expect(SyncOperationType.upload.toString(), contains('upload')),
    );
  });

  group('SyncOperationType — equality', () {
    test(
      'create == create',
      () => expect(SyncOperationType.create, SyncOperationType.create),
    );
    test(
      'update == update',
      () => expect(SyncOperationType.update, SyncOperationType.update),
    );
    test(
      'create != update',
      () => expect(SyncOperationType.create, isNot(SyncOperationType.update)),
    );
    test(
      'delete != upload',
      () => expect(SyncOperationType.delete, isNot(SyncOperationType.upload)),
    );
    test('all values are distinct', () {
      final values = SyncOperationType.values;
      final unique = values.toSet();
      expect(unique.length, values.length);
    });
  });

  group('SyncOperationType — name parsing', () {
    test('can find by name "create"', () {
      final found = SyncOperationType.values.firstWhere(
        (e) => e.name == 'create',
      );
      expect(found, SyncOperationType.create);
    });
    test('can find by name "update"', () {
      final found = SyncOperationType.values.firstWhere(
        (e) => e.name == 'update',
      );
      expect(found, SyncOperationType.update);
    });
    test('can find by name "delete"', () {
      final found = SyncOperationType.values.firstWhere(
        (e) => e.name == 'delete',
      );
      expect(found, SyncOperationType.delete);
    });
    test('can find by name "upload"', () {
      final found = SyncOperationType.values.firstWhere(
        (e) => e.name == 'upload',
      );
      expect(found, SyncOperationType.upload);
    });
    test('throws StateError for unknown name', () {
      expect(
        () => SyncOperationType.values.firstWhere((e) => e.name == 'unknown'),
        throwsStateError,
      );
    });
  });

  group('SyncOperationType — mutation semantics', () {
    test('create and update are non-destructive ops', () {
      const nonDestructive = [
        SyncOperationType.create,
        SyncOperationType.update,
      ];
      expect(nonDestructive, isNot(contains(SyncOperationType.delete)));
    });
    test('delete is the only destructive op', () {
      const destructive = SyncOperationType.delete;
      expect(destructive.name, 'delete');
      expect(
        SyncOperationType.values.where((e) => e.name.startsWith('d')),
        hasLength(1),
      );
    });
    test('upload is only media op', () {
      expect(SyncOperationType.upload.name, 'upload');
    });
  });
}
