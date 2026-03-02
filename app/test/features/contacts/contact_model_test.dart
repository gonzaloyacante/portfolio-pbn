import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/contacts/data/contact_model.dart';

void main() {
  final now = DateTime(2024, 1, 1);

  // ── ContactItem ─────────────────────────────────────────────────────────

  group('ContactItem — defaults', () {
    late ContactItem item;

    setUp(() {
      item = ContactItem(
        id: 'ci1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        createdAt: now,
        updatedAt: now,
      );
    });

    test('stores id', () => expect(item.id, 'ci1'));
    test('stores name', () => expect(item.name, 'Juan Pérez'));
    test('stores email', () => expect(item.email, 'juan@example.com'));
    test('phone defaults to null', () => expect(item.phone, isNull));
    test('subject defaults to null', () => expect(item.subject, isNull));
    test('status defaults to NEW', () => expect(item.status, 'NEW'));
    test('priority defaults to MEDIUM', () => expect(item.priority, 'MEDIUM'));
    test('isRead defaults to false', () => expect(item.isRead, false));
    test('isReplied defaults to false', () => expect(item.isReplied, false));
    test('readAt defaults to null', () => expect(item.readAt, isNull));
    test('repliedAt defaults to null', () => expect(item.repliedAt, isNull));
    test('leadScore defaults to null', () => expect(item.leadScore, isNull));
    test('leadSource defaults to null', () => expect(item.leadSource, isNull));
    test('tags defaults to empty list', () => expect(item.tags, isEmpty));
  });

  group('ContactItem — custom values', () {
    test('stores phone', () {
      final item = ContactItem(
        id: 'ci2',
        name: 'N',
        email: 'e@e.com',
        phone: '666123456',
        createdAt: now,
        updatedAt: now,
      );
      expect(item.phone, '666123456');
    });

    test('stores status RESOLVED', () {
      final item = ContactItem(
        id: 'ci3',
        name: 'N',
        email: 'e@e.com',
        status: 'RESOLVED',
        createdAt: now,
        updatedAt: now,
      );
      expect(item.status, 'RESOLVED');
    });

    test('stores priority HIGH', () {
      final item = ContactItem(
        id: 'ci4',
        name: 'N',
        email: 'e@e.com',
        priority: 'HIGH',
        createdAt: now,
        updatedAt: now,
      );
      expect(item.priority, 'HIGH');
    });

    test('stores tags', () {
      final item = ContactItem(
        id: 'ci5',
        name: 'N',
        email: 'e@e.com',
        tags: ['vip', 'urgent'],
        createdAt: now,
        updatedAt: now,
      );
      expect(item.tags, ['vip', 'urgent']);
    });

    test('isRead can be true', () {
      final item = ContactItem(
        id: 'ci6',
        name: 'N',
        email: 'e@e.com',
        isRead: true,
        isReplied: true,
        createdAt: now,
        updatedAt: now,
      );
      expect(item.isRead, true);
      expect(item.isReplied, true);
    });
  });

  group('ContactItem — equality', () {
    test('same values are equal', () {
      final a = ContactItem(
        id: 'ci1',
        name: 'N',
        email: 'e@e.com',
        createdAt: now,
        updatedAt: now,
      );
      final b = ContactItem(
        id: 'ci1',
        name: 'N',
        email: 'e@e.com',
        createdAt: now,
        updatedAt: now,
      );
      expect(a, equals(b));
    });

    test('different id makes not equal', () {
      final a = ContactItem(
        id: 'ci1',
        name: 'N',
        email: 'e@e.com',
        createdAt: now,
        updatedAt: now,
      );
      final b = ContactItem(
        id: 'ci2',
        name: 'N',
        email: 'e@e.com',
        createdAt: now,
        updatedAt: now,
      );
      expect(a, isNot(equals(b)));
    });
  });

  group('ContactItem — copyWith', () {
    test('copyWith updates status', () {
      final item = ContactItem(
        id: 'ci1',
        name: 'N',
        email: 'e@e.com',
        createdAt: now,
        updatedAt: now,
      );
      final updated = item.copyWith(status: 'IN_PROGRESS', isRead: true);
      expect(updated.status, 'IN_PROGRESS');
      expect(updated.isRead, true);
      expect(updated.id, 'ci1');
    });
  });

  // ── ContactDetail ───────────────────────────────────────────────────────

  group('ContactDetail — defaults', () {
    late ContactDetail detail;

    setUp(() {
      detail = ContactDetail(
        id: 'cd1',
        name: 'Juan',
        email: 'juan@example.com',
        message: 'Hola, me interesa un retrato.',
        createdAt: now,
        updatedAt: now,
      );
    });

    test(
      'stores message',
      () => expect(detail.message, 'Hola, me interesa un retrato.'),
    );
    test(
      'responsePreference defaults to EMAIL',
      () => expect(detail.responsePreference, 'EMAIL'),
    );
    test(
      'assignedTo defaults to null',
      () => expect(detail.assignedTo, isNull),
    );
    test('readBy defaults to null', () => expect(detail.readBy, isNull));
    test('replyText defaults to null', () => expect(detail.replyText, isNull));
    test('adminNote defaults to null', () => expect(detail.adminNote, isNull));
    test('ipAddress defaults to null', () => expect(detail.ipAddress, isNull));
    test('utmSource defaults to null', () => expect(detail.utmSource, isNull));
  });

  group('ContactDetail — UTM fields', () {
    test('stores UTM tracking fields', () {
      final detail = ContactDetail(
        id: 'cd2',
        name: 'N',
        email: 'e@e.com',
        message: 'M',
        utmSource: 'instagram',
        utmMedium: 'social',
        utmCampaign: 'promo2024',
        createdAt: now,
        updatedAt: now,
      );
      expect(detail.utmSource, 'instagram');
      expect(detail.utmMedium, 'social');
      expect(detail.utmCampaign, 'promo2024');
    });
  });
}
