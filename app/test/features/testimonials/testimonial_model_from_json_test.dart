import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/testimonials/data/testimonial_model.dart';

void main() {
  // ── TestimonialItem fromJson ──────────────────────────────────────────────

  group('TestimonialItem.fromJson — required fields', () {
    Map<String, dynamic> base0() => {
      'id': 't1',
      'name': 'Laura Sánchez',
      'createdAt': '2024-01-10T00:00:00Z',
      'updatedAt': '2024-01-10T00:00:00Z',
    };

    test('parses id', () => expect(TestimonialItem.fromJson(base0()).id, 't1'));
    test(
      'parses name',
      () => expect(TestimonialItem.fromJson(base0()).name, 'Laura Sánchez'),
    );
    test(
      'createdAt is DateTime',
      () =>
          expect(TestimonialItem.fromJson(base0()).createdAt, isA<DateTime>()),
    );
    test(
      'updatedAt is DateTime',
      () =>
          expect(TestimonialItem.fromJson(base0()).updatedAt, isA<DateTime>()),
    );
  });

  group('TestimonialItem.fromJson — defaults', () {
    final base = {
      'id': 't1',
      'name': 'Test',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'rating defaults to 5',
      () => expect(TestimonialItem.fromJson(base).rating, 5),
    );
    test(
      'verified defaults to false',
      () => expect(TestimonialItem.fromJson(base).verified, isFalse),
    );
    test(
      'featured defaults to false',
      () => expect(TestimonialItem.fromJson(base).featured, isFalse),
    );
    test(
      'status defaults to "PENDING"',
      () => expect(TestimonialItem.fromJson(base).status, 'PENDING'),
    );
    test(
      'isActive defaults to true',
      () => expect(TestimonialItem.fromJson(base).isActive, isTrue),
    );
    test(
      'sortOrder defaults to 0',
      () => expect(TestimonialItem.fromJson(base).sortOrder, 0),
    );
    test(
      'viewCount defaults to 0',
      () => expect(TestimonialItem.fromJson(base).viewCount, 0),
    );
    test(
      'excerpt is null',
      () => expect(TestimonialItem.fromJson(base).excerpt, isNull),
    );
    test(
      'position is null',
      () => expect(TestimonialItem.fromJson(base).position, isNull),
    );
    test(
      'company is null',
      () => expect(TestimonialItem.fromJson(base).company, isNull),
    );
    test(
      'avatarUrl is null',
      () => expect(TestimonialItem.fromJson(base).avatarUrl, isNull),
    );
  });

  group('TestimonialItem.fromJson — optional fields', () {
    Map<String, dynamic> full() => {
      'id': 't2',
      'name': 'Carmen Torres',
      'excerpt': 'Excelente profesional',
      'position': 'Novia',
      'company': 'Evento particular',
      'avatarUrl': 'https://x.com/avatar.jpg',
      'rating': 4,
      'verified': true,
      'featured': true,
      'status': 'APPROVED',
      'isActive': true,
      'sortOrder': 2,
      'viewCount': 55,
      'createdAt': '2024-03-01T00:00:00Z',
      'updatedAt': '2024-03-05T00:00:00Z',
    };

    test(
      'parses excerpt',
      () => expect(
        TestimonialItem.fromJson(full()).excerpt,
        'Excelente profesional',
      ),
    );
    test(
      'parses position',
      () => expect(TestimonialItem.fromJson(full()).position, 'Novia'),
    );
    test(
      'parses company',
      () =>
          expect(TestimonialItem.fromJson(full()).company, 'Evento particular'),
    );
    test(
      'parses avatarUrl',
      () => expect(
        TestimonialItem.fromJson(full()).avatarUrl,
        'https://x.com/avatar.jpg',
      ),
    );
    test(
      'parses rating',
      () => expect(TestimonialItem.fromJson(full()).rating, 4),
    );
    test(
      'parses verified = true',
      () => expect(TestimonialItem.fromJson(full()).verified, isTrue),
    );
    test(
      'parses featured = true',
      () => expect(TestimonialItem.fromJson(full()).featured, isTrue),
    );
    test(
      'parses status',
      () => expect(TestimonialItem.fromJson(full()).status, 'APPROVED'),
    );
    test(
      'parses sortOrder',
      () => expect(TestimonialItem.fromJson(full()).sortOrder, 2),
    );
    test(
      'parses viewCount',
      () => expect(TestimonialItem.fromJson(full()).viewCount, 55),
    );
    test('createdAt parsed correctly', () {
      expect(TestimonialItem.fromJson(full()).createdAt.month, 3);
    });
  });

  group('TestimonialItem — equality and copyWith', () {
    final base = {
      'id': 't1',
      'name': 'Test',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('two equal items', () {
      expect(TestimonialItem.fromJson(base), TestimonialItem.fromJson(base));
    });

    test('copyWith status', () {
      final t = TestimonialItem.fromJson(base);
      expect(t.copyWith(status: 'APPROVED').status, 'APPROVED');
    });

    test('copyWith featured', () {
      final t = TestimonialItem.fromJson(base);
      expect(t.copyWith(featured: true).featured, isTrue);
    });
  });

  // ── TestimonialDetail fromJson ────────────────────────────────────────────

  group('TestimonialDetail.fromJson — required fields', () {
    Map<String, dynamic> base0() => {
      'id': 'td1',
      'name': 'Marta Ruiz',
      'text': 'Increíble trabajo, recomiendo totalmente.',
      'createdAt': '2024-04-01T00:00:00Z',
      'updatedAt': '2024-04-01T00:00:00Z',
    };

    test(
      'parses id',
      () => expect(TestimonialDetail.fromJson(base0()).id, 'td1'),
    );
    test(
      'parses name',
      () => expect(TestimonialDetail.fromJson(base0()).name, 'Marta Ruiz'),
    );
    test(
      'parses text',
      () => expect(
        TestimonialDetail.fromJson(base0()).text,
        'Increíble trabajo, recomiendo totalmente.',
      ),
    );
  });

  group('TestimonialDetail.fromJson — defaults', () {
    final base = {
      'id': 'td1',
      'name': 'Test',
      'text': 'Text',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'rating defaults to 5',
      () => expect(TestimonialDetail.fromJson(base).rating, 5),
    );
    test(
      'verified defaults to false',
      () => expect(TestimonialDetail.fromJson(base).verified, isFalse),
    );
    test(
      'status defaults to "PENDING"',
      () => expect(TestimonialDetail.fromJson(base).status, 'PENDING'),
    );
    test(
      'isActive defaults to true',
      () => expect(TestimonialDetail.fromJson(base).isActive, isTrue),
    );
    test(
      'email is null',
      () => expect(TestimonialDetail.fromJson(base).email, isNull),
    );
    test(
      'source is null',
      () => expect(TestimonialDetail.fromJson(base).source, isNull),
    );
    test(
      'projectId is null',
      () => expect(TestimonialDetail.fromJson(base).projectId, isNull),
    );
    test(
      'moderatedBy is null',
      () => expect(TestimonialDetail.fromJson(base).moderatedBy, isNull),
    );
    test(
      'moderatedAt is null',
      () => expect(TestimonialDetail.fromJson(base).moderatedAt, isNull),
    );
  });

  group('TestimonialDetail.fromJson — optional fields', () {
    Map<String, dynamic> full() => {
      'id': 'td2',
      'name': 'Elena Vidal',
      'text': 'Muy satisfecha con el resultado.',
      'email': 'elena@test.com',
      'phone': '+34 666 000 000',
      'position': 'Madrina',
      'company': null,
      'website': 'https://elena.com',
      'avatarUrl': 'https://x.com/ava.jpg',
      'source': 'google',
      'projectId': 'proj-5',
      'moderatedBy': 'admin',
      'status': 'APPROVED',
      'featured': true,
      'createdAt': '2024-05-01T00:00:00Z',
      'updatedAt': '2024-05-01T00:00:00Z',
    };

    test(
      'parses email',
      () => expect(TestimonialDetail.fromJson(full()).email, 'elena@test.com'),
    );
    test(
      'parses website',
      () => expect(
        TestimonialDetail.fromJson(full()).website,
        'https://elena.com',
      ),
    );
    test(
      'parses source',
      () => expect(TestimonialDetail.fromJson(full()).source, 'google'),
    );
    test(
      'parses projectId',
      () => expect(TestimonialDetail.fromJson(full()).projectId, 'proj-5'),
    );
    test(
      'parses moderatedBy',
      () => expect(TestimonialDetail.fromJson(full()).moderatedBy, 'admin'),
    );
    test(
      'parses status = APPROVED',
      () => expect(TestimonialDetail.fromJson(full()).status, 'APPROVED'),
    );
    test(
      'parses featured = true',
      () => expect(TestimonialDetail.fromJson(full()).featured, isTrue),
    );
  });

  // ── TestimonialFormData ───────────────────────────────────────────────────

  group('TestimonialFormData.toJson', () {
    test('required fields in json', () {
      final j = TestimonialFormData(name: 'Test', text: 'Comment').toJson();
      expect(j['name'], 'Test');
      expect(j['text'], 'Comment');
    });
    test('default rating is 5', () {
      expect(TestimonialFormData(name: 'T', text: 'T').toJson()['rating'], 5);
    });
    test('default status is PENDING', () {
      expect(
        TestimonialFormData(name: 'T', text: 'T').toJson()['status'],
        'PENDING',
      );
    });
    test('optional fields absent when null', () {
      final j = TestimonialFormData(name: 'T', text: 'T').toJson();
      expect(j.containsKey('email'), isFalse);
      expect(j.containsKey('source'), isFalse);
    });
    test('optional fields present when set', () {
      final j = TestimonialFormData(
        name: 'T',
        text: 'T',
        email: 'a@test.com',
      ).toJson();
      expect(j['email'], 'a@test.com');
    });
  });
}
