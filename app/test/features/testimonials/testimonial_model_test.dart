import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/testimonials/data/testimonial_model.dart';

void main() {
  final now = DateTime(2024, 1, 1);

  // ── TestimonialItem ─────────────────────────────────────────────────────

  group('TestimonialItem — defaults', () {
    late TestimonialItem item;

    setUp(() {
      item = TestimonialItem(
        id: 't1',
        name: 'Ana García',
        createdAt: now,
        updatedAt: now,
      );
    });

    test('stores id', () => expect(item.id, 't1'));
    test('stores name', () => expect(item.name, 'Ana García'));
    test('rating defaults to 5', () => expect(item.rating, 5));
    test('verified defaults to false', () => expect(item.verified, false));
    test('featured defaults to false', () => expect(item.featured, false));
    test('status defaults to PENDING', () => expect(item.status, 'PENDING'));
    test('isActive defaults to true', () => expect(item.isActive, true));
    test('sortOrder defaults to 0', () => expect(item.sortOrder, 0));
    test('viewCount defaults to 0', () => expect(item.viewCount, 0));
    test('excerpt defaults to null', () => expect(item.excerpt, isNull));
    test('position defaults to null', () => expect(item.position, isNull));
    test('company defaults to null', () => expect(item.company, isNull));
    test('avatarUrl defaults to null', () => expect(item.avatarUrl, isNull));
  });

  group('TestimonialItem — custom values', () {
    test('stores rating', () {
      final item = TestimonialItem(
        id: 't2',
        name: 'Bob',
        rating: 4,
        verified: true,
        featured: true,
        status: 'APPROVED',
        createdAt: now,
        updatedAt: now,
      );
      expect(item.rating, 4);
      expect(item.verified, true);
      expect(item.featured, true);
      expect(item.status, 'APPROVED');
    });

    test('stores position and company', () {
      final item = TestimonialItem(
        id: 't3',
        name: 'Carlos',
        position: 'CEO',
        company: 'Acme',
        createdAt: now,
        updatedAt: now,
      );
      expect(item.position, 'CEO');
      expect(item.company, 'Acme');
    });
  });

  group('TestimonialItem — equality', () {
    test('same values are equal', () {
      final a = TestimonialItem(
        id: 't1',
        name: 'Ana',
        createdAt: now,
        updatedAt: now,
      );
      final b = TestimonialItem(
        id: 't1',
        name: 'Ana',
        createdAt: now,
        updatedAt: now,
      );
      expect(a, equals(b));
    });

    test('different id makes not equal', () {
      final a = TestimonialItem(
        id: 't1',
        name: 'Ana',
        createdAt: now,
        updatedAt: now,
      );
      final b = TestimonialItem(
        id: 't2',
        name: 'Ana',
        createdAt: now,
        updatedAt: now,
      );
      expect(a, isNot(equals(b)));
    });
  });

  // ── TestimonialDetail ───────────────────────────────────────────────────

  group('TestimonialDetail — defaults', () {
    late TestimonialDetail detail;

    setUp(() {
      detail = TestimonialDetail(
        id: 't1',
        name: 'Ana',
        text: 'Excelente trabajo.',
        createdAt: now,
        updatedAt: now,
      );
    });

    test('stores text', () => expect(detail.text, 'Excelente trabajo.'));
    test('email defaults to null', () => expect(detail.email, isNull));
    test('phone defaults to null', () => expect(detail.phone, isNull));
    test('rating defaults to 5', () => expect(detail.rating, 5));
    test('status defaults to PENDING', () => expect(detail.status, 'PENDING'));
    test(
      'moderatedBy defaults to null',
      () => expect(detail.moderatedBy, isNull),
    );
    test('source defaults to null', () => expect(detail.source, isNull));
    test('projectId defaults to null', () => expect(detail.projectId, isNull));
  });

  // ── TestimonialFormData ─────────────────────────────────────────────────

  group('TestimonialFormData — construction', () {
    test('required fields are stored', () {
      const form = TestimonialFormData(name: 'Ana', text: 'Great!');
      expect(form.name, 'Ana');
      expect(form.text, 'Great!');
    });

    test('rating defaults to 5', () {
      const form = TestimonialFormData(name: 'N', text: 'T');
      expect(form.rating, 5);
    });

    test('status defaults to PENDING', () {
      const form = TestimonialFormData(name: 'N', text: 'T');
      expect(form.status, 'PENDING');
    });

    test('isActive defaults to true', () {
      const form = TestimonialFormData(name: 'N', text: 'T');
      expect(form.isActive, true);
    });
  });

  group('TestimonialFormData — toJson', () {
    test('includes required fields', () {
      const form = TestimonialFormData(name: 'Ana', text: 'Great!');
      final json = form.toJson();
      expect(json['name'], 'Ana');
      expect(json['text'], 'Great!');
      expect(json['rating'], 5);
      expect(json['status'], 'PENDING');
      expect(json['isActive'], true);
    });

    test('omits null optional fields', () {
      const form = TestimonialFormData(name: 'N', text: 'T');
      final json = form.toJson();
      expect(json.containsKey('email'), false);
      expect(json.containsKey('phone'), false);
      expect(json.containsKey('position'), false);
      expect(json.containsKey('company'), false);
    });

    test('includes optional fields when set', () {
      const form = TestimonialFormData(
        name: 'N',
        text: 'T',
        email: 'ana@example.com',
        position: 'Manager',
        rating: 4,
        verified: true,
      );
      final json = form.toJson();
      expect(json['email'], 'ana@example.com');
      expect(json['position'], 'Manager');
      expect(json['rating'], 4);
      expect(json['verified'], true);
    });
  });
}
