import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/contacts/data/contact_model.dart';

void main() {
  // ── ContactItem fromJson ──────────────────────────────────────────────────

  group('ContactItem.fromJson — required fields', () {
    Map<String, dynamic> _base() => {
      'id': 'c1',
      'name': 'Ana García',
      'email': 'ana@example.com',
      'createdAt': '2024-01-15T10:00:00Z',
      'updatedAt': '2024-01-15T10:00:00Z',
    };

    test('parses id correctly', () {
      expect(ContactItem.fromJson(_base()).id, 'c1');
    });
    test('parses name correctly', () {
      expect(ContactItem.fromJson(_base()).name, 'Ana García');
    });
    test('parses email correctly', () {
      expect(ContactItem.fromJson(_base()).email, 'ana@example.com');
    });
    test('parses createdAt as DateTime', () {
      expect(ContactItem.fromJson(_base()).createdAt, isA<DateTime>());
    });
    test('parses updatedAt as DateTime', () {
      expect(ContactItem.fromJson(_base()).updatedAt, isA<DateTime>());
    });
  });

  group('ContactItem.fromJson — defaults', () {
    final base = {
      'id': 'c1',
      'name': 'Test',
      'email': 'test@test.com',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'status defaults to "NEW"',
      () => expect(ContactItem.fromJson(base).status, 'NEW'),
    );
    test(
      'priority defaults to "MEDIUM"',
      () => expect(ContactItem.fromJson(base).priority, 'MEDIUM'),
    );
    test(
      'isRead defaults to false',
      () => expect(ContactItem.fromJson(base).isRead, isFalse),
    );
    test(
      'isReplied defaults to false',
      () => expect(ContactItem.fromJson(base).isReplied, isFalse),
    );
    test(
      'tags defaults to empty list',
      () => expect(ContactItem.fromJson(base).tags, isEmpty),
    );
    test(
      'phone is null',
      () => expect(ContactItem.fromJson(base).phone, isNull),
    );
    test(
      'subject is null',
      () => expect(ContactItem.fromJson(base).subject, isNull),
    );
    test(
      'readAt is null',
      () => expect(ContactItem.fromJson(base).readAt, isNull),
    );
    test(
      'repliedAt is null',
      () => expect(ContactItem.fromJson(base).repliedAt, isNull),
    );
    test(
      'leadScore is null',
      () => expect(ContactItem.fromJson(base).leadScore, isNull),
    );
    test(
      'leadSource is null',
      () => expect(ContactItem.fromJson(base).leadSource, isNull),
    );
  });

  group('ContactItem.fromJson — optional fields', () {
    Map<String, dynamic> _full() => {
      'id': 'c2',
      'name': 'Carlos López',
      'email': 'carlos@test.com',
      'phone': '+34 600 123 456',
      'subject': 'Consulta de precio',
      'status': 'REPLIED',
      'priority': 'HIGH',
      'isRead': true,
      'isReplied': true,
      'leadScore': 85,
      'leadSource': 'instagram',
      'tags': ['vip', 'boda'],
      'createdAt': '2024-02-10T09:00:00Z',
      'updatedAt': '2024-02-12T10:00:00Z',
    };

    test(
      'parses phone',
      () => expect(ContactItem.fromJson(_full()).phone, '+34 600 123 456'),
    );
    test(
      'parses subject',
      () => expect(ContactItem.fromJson(_full()).subject, 'Consulta de precio'),
    );
    test(
      'parses status',
      () => expect(ContactItem.fromJson(_full()).status, 'REPLIED'),
    );
    test(
      'parses priority',
      () => expect(ContactItem.fromJson(_full()).priority, 'HIGH'),
    );
    test(
      'parses isRead = true',
      () => expect(ContactItem.fromJson(_full()).isRead, isTrue),
    );
    test(
      'parses isReplied = true',
      () => expect(ContactItem.fromJson(_full()).isReplied, isTrue),
    );
    test(
      'parses leadScore',
      () => expect(ContactItem.fromJson(_full()).leadScore, 85),
    );
    test(
      'parses leadSource',
      () => expect(ContactItem.fromJson(_full()).leadSource, 'instagram'),
    );
    test(
      'parses tags list',
      () => expect(ContactItem.fromJson(_full()).tags, ['vip', 'boda']),
    );
    test('createdAt is parsed as DateTime', () {
      final item = ContactItem.fromJson(_full());
      expect(item.createdAt.year, 2024);
      expect(item.createdAt.month, 2);
      expect(item.createdAt.day, 10);
    });
  });

  group('ContactItem — equality and copyWith', () {
    final base = {
      'id': 'c1',
      'name': 'Test',
      'email': 'test@test.com',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('two items with same data are equal', () {
      final a = ContactItem.fromJson(base);
      final b = ContactItem.fromJson(base);
      expect(a, b);
    });

    test('copyWith status returns new item', () {
      final item = ContactItem.fromJson(base);
      final updated = item.copyWith(status: 'READ');
      expect(updated.status, 'READ');
      expect(updated.id, item.id);
    });

    test('copyWith isRead updates correctly', () {
      final item = ContactItem.fromJson(base);
      final updated = item.copyWith(isRead: true);
      expect(updated.isRead, isTrue);
    });

    test('copyWith tags updates list', () {
      final item = ContactItem.fromJson(base);
      final updated = item.copyWith(tags: ['new-tag']);
      expect(updated.tags, ['new-tag']);
    });
  });

  // ── ContactDetail fromJson ────────────────────────────────────────────────

  group('ContactDetail.fromJson — required fields', () {
    Map<String, dynamic> _base() => {
      'id': 'd1',
      'name': 'María Pérez',
      'email': 'maria@test.com',
      'message': 'Hola, quiero información sobre bodas.',
      'createdAt': '2024-03-01T08:00:00Z',
      'updatedAt': '2024-03-01T08:00:00Z',
    };

    test('parses id', () => expect(ContactDetail.fromJson(_base()).id, 'd1'));
    test(
      'parses name',
      () => expect(ContactDetail.fromJson(_base()).name, 'María Pérez'),
    );
    test(
      'parses email',
      () => expect(ContactDetail.fromJson(_base()).email, 'maria@test.com'),
    );
    test(
      'parses message',
      () => expect(
        ContactDetail.fromJson(_base()).message,
        'Hola, quiero información sobre bodas.',
      ),
    );
    test(
      'createdAt is DateTime',
      () => expect(ContactDetail.fromJson(_base()).createdAt, isA<DateTime>()),
    );
  });

  group('ContactDetail.fromJson — defaults', () {
    final base = {
      'id': 'd1',
      'name': 'Test',
      'email': 'test@test.com',
      'message': 'Test message',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('responsePreference defaults to "EMAIL"', () {
      expect(ContactDetail.fromJson(base).responsePreference, 'EMAIL');
    });
    test(
      'status defaults to "NEW"',
      () => expect(ContactDetail.fromJson(base).status, 'NEW'),
    );
    test(
      'priority defaults to "MEDIUM"',
      () => expect(ContactDetail.fromJson(base).priority, 'MEDIUM'),
    );
    test(
      'isRead defaults to false',
      () => expect(ContactDetail.fromJson(base).isRead, isFalse),
    );
    test(
      'isReplied defaults to false',
      () => expect(ContactDetail.fromJson(base).isReplied, isFalse),
    );
    test(
      'tags defaults to empty',
      () => expect(ContactDetail.fromJson(base).tags, isEmpty),
    );
    test(
      'assignedTo is null',
      () => expect(ContactDetail.fromJson(base).assignedTo, isNull),
    );
    test(
      'adminNote is null',
      () => expect(ContactDetail.fromJson(base).adminNote, isNull),
    );
    test(
      'ipAddress is null',
      () => expect(ContactDetail.fromJson(base).ipAddress, isNull),
    );
    test(
      'utmSource is null',
      () => expect(ContactDetail.fromJson(base).utmSource, isNull),
    );
    test(
      'utmMedium is null',
      () => expect(ContactDetail.fromJson(base).utmMedium, isNull),
    );
    test(
      'utmCampaign is null',
      () => expect(ContactDetail.fromJson(base).utmCampaign, isNull),
    );
  });

  group('ContactDetail.fromJson — optional fields', () {
    Map<String, dynamic> _full() => {
      'id': 'd2',
      'name': 'Full Contact',
      'email': 'full@test.com',
      'message': 'Full message',
      'phone': '+34 911 000 000',
      'subject': 'Subject text',
      'responsePreference': 'PHONE',
      'leadScore': 92,
      'leadSource': 'referral',
      'status': 'ARCHIVED',
      'priority': 'LOW',
      'assignedTo': 'admin',
      'isRead': true,
      'isReplied': true,
      'replyText': 'We replied',
      'adminNote': 'VIP client',
      'tags': ['client', 'vip'],
      'ipAddress': '192.168.1.1',
      'referrer': 'https://google.com',
      'utmSource': 'google',
      'utmMedium': 'cpc',
      'utmCampaign': 'summer2024',
      'createdAt': '2024-04-01T12:00:00Z',
      'updatedAt': '2024-04-02T12:00:00Z',
    };

    test(
      'parses phone',
      () => expect(ContactDetail.fromJson(_full()).phone, '+34 911 000 000'),
    );
    test(
      'parses responsePreference',
      () => expect(ContactDetail.fromJson(_full()).responsePreference, 'PHONE'),
    );
    test(
      'parses leadScore',
      () => expect(ContactDetail.fromJson(_full()).leadScore, 92),
    );
    test(
      'parses leadSource',
      () => expect(ContactDetail.fromJson(_full()).leadSource, 'referral'),
    );
    test(
      'parses status',
      () => expect(ContactDetail.fromJson(_full()).status, 'ARCHIVED'),
    );
    test(
      'parses priority',
      () => expect(ContactDetail.fromJson(_full()).priority, 'LOW'),
    );
    test(
      'parses assignedTo',
      () => expect(ContactDetail.fromJson(_full()).assignedTo, 'admin'),
    );
    test(
      'parses isRead = true',
      () => expect(ContactDetail.fromJson(_full()).isRead, isTrue),
    );
    test(
      'parses replyText',
      () => expect(ContactDetail.fromJson(_full()).replyText, 'We replied'),
    );
    test(
      'parses adminNote',
      () => expect(ContactDetail.fromJson(_full()).adminNote, 'VIP client'),
    );
    test(
      'parses tags list',
      () => expect(ContactDetail.fromJson(_full()).tags, ['client', 'vip']),
    );
    test(
      'parses ipAddress',
      () => expect(ContactDetail.fromJson(_full()).ipAddress, '192.168.1.1'),
    );
    test(
      'parses referrer',
      () => expect(
        ContactDetail.fromJson(_full()).referrer,
        'https://google.com',
      ),
    );
    test(
      'parses utmSource',
      () => expect(ContactDetail.fromJson(_full()).utmSource, 'google'),
    );
    test(
      'parses utmMedium',
      () => expect(ContactDetail.fromJson(_full()).utmMedium, 'cpc'),
    );
    test(
      'parses utmCampaign',
      () => expect(ContactDetail.fromJson(_full()).utmCampaign, 'summer2024'),
    );
  });

  group('ContactDetail — copyWith', () {
    final base = {
      'id': 'd1',
      'name': 'Test',
      'email': 'test@test.com',
      'message': 'msg',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('copyWith status applies', () {
      final detail = ContactDetail.fromJson(base);
      expect(detail.copyWith(status: 'READ').status, 'READ');
    });

    test('copyWith adminNote applies', () {
      final detail = ContactDetail.fromJson(base);
      expect(detail.copyWith(adminNote: 'Important').adminNote, 'Important');
    });

    test('original unchanged after copyWith', () {
      final detail = ContactDetail.fromJson(base);
      detail.copyWith(status: 'READ');
      expect(detail.status, 'NEW'); // original unchanged
    });
  });
}
