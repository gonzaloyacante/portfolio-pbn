import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/services/data/service_model.dart';

void main() {
  // ── ServiceItem ─────────────────────────────────────────────────────────

  group('ServiceItem — defaults', () {
    const item = ServiceItem(
      id: 's1',
      name: 'Retrato',
      slug: 'retrato',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    );

    test('stores id', () => expect(item.id, 's1'));
    test('stores name', () => expect(item.name, 'Retrato'));
    test('stores slug', () => expect(item.slug, 'retrato'));
    test('shortDesc defaults to null', () => expect(item.shortDesc, isNull));
    test('price defaults to null', () => expect(item.price, isNull));
    test('priceLabel defaults to null', () => expect(item.priceLabel, isNull));
    test('currency defaults to EUR', () => expect(item.currency, 'EUR'));
    test('isActive defaults to true', () => expect(item.isActive, true));
    test('isFeatured defaults to false', () => expect(item.isFeatured, false));
    test('isAvailable defaults to true', () => expect(item.isAvailable, true));
    test('sortOrder defaults to 0', () => expect(item.sortOrder, 0));
    test('bookingCount defaults to 0', () => expect(item.bookingCount, 0));
    test('viewCount defaults to 0', () => expect(item.viewCount, 0));
  });

  group('ServiceItem — custom values', () {
    const item = ServiceItem(
      id: 's2',
      name: 'Boda',
      slug: 'boda',
      price: '500',
      currency: 'USD',
      isFeatured: true,
      isAvailable: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    );

    test('stores price', () => expect(item.price, '500'));
    test('stores currency', () => expect(item.currency, 'USD'));
    test('stores isFeatured=true', () => expect(item.isFeatured, true));
    test('stores isAvailable=false', () => expect(item.isAvailable, false));
  });

  group('ServiceItem — equality', () {
    const m = '2024-01-01T00:00:00Z';

    test('same values are equal', () {
      const a = ServiceItem(
        id: 's1',
        name: 'Retrato',
        slug: 'retrato',
        createdAt: m,
        updatedAt: m,
      );
      const b = ServiceItem(
        id: 's1',
        name: 'Retrato',
        slug: 'retrato',
        createdAt: m,
        updatedAt: m,
      );
      expect(a, equals(b));
    });

    test('different id makes not equal', () {
      const a = ServiceItem(
        id: 's1',
        name: 'Retrato',
        slug: 'retrato',
        createdAt: m,
        updatedAt: m,
      );
      const b = ServiceItem(
        id: 's2',
        name: 'Retrato',
        slug: 'retrato',
        createdAt: m,
        updatedAt: m,
      );
      expect(a, isNot(equals(b)));
    });
  });

  // ── ServiceDetail ───────────────────────────────────────────────────────

  group('ServiceDetail — defaults', () {
    const detail = ServiceDetail(
      id: 's1',
      name: 'Retrato',
      slug: 'retrato',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    );

    test('stores id', () => expect(detail.id, 's1'));
    test('currency defaults to EUR', () => expect(detail.currency, 'EUR'));
    test(
      'metaKeywords defaults to empty list',
      () => expect(detail.metaKeywords, isEmpty),
    );
    test(
      'durationMinutes defaults to null',
      () => expect(detail.durationMinutes, isNull),
    );
    test(
      'maxBookingsPerDay defaults to null',
      () => expect(detail.maxBookingsPerDay, isNull),
    );
    test(
      'requirements defaults to null',
      () => expect(detail.requirements, isNull),
    );
    test(
      'cancellationPolicy defaults to null',
      () => expect(detail.cancellationPolicy, isNull),
    );
  });

  // ── ServiceFormData ─────────────────────────────────────────────────────

  group('ServiceFormData — construction', () {
    test('required fields are stored', () {
      const form = ServiceFormData(name: 'Retrato', slug: 'retrato');
      expect(form.name, 'Retrato');
      expect(form.slug, 'retrato');
    });

    test('priceLabel defaults to desde', () {
      const form = ServiceFormData(name: 'N', slug: 's');
      expect(form.priceLabel, 'desde');
    });

    test('currency defaults to EUR', () {
      const form = ServiceFormData(name: 'N', slug: 's');
      expect(form.currency, 'EUR');
    });

    test('isActive defaults to true', () {
      const form = ServiceFormData(name: 'N', slug: 's');
      expect(form.isActive, true);
    });

    test('isFeatured defaults to false', () {
      const form = ServiceFormData(name: 'N', slug: 's');
      expect(form.isFeatured, false);
    });
  });

  group('ServiceFormData — toJson', () {
    test('includes required fields', () {
      const form = ServiceFormData(name: 'Retrato', slug: 'retrato');
      final json = form.toJson();
      expect(json['name'], 'Retrato');
      expect(json['slug'], 'retrato');
      expect(json['currency'], 'EUR');
      expect(json['isActive'], true);
      expect(json['isFeatured'], false);
    });

    test('includes optional price when set', () {
      const form = ServiceFormData(name: 'N', slug: 's', price: '100');
      final json = form.toJson();
      expect(json['price'], '100');
    });

    test('omits null optional fields', () {
      const form = ServiceFormData(name: 'N', slug: 's');
      final json = form.toJson();
      expect(json.containsKey('description'), false);
      expect(json.containsKey('shortDesc'), false);
      expect(json.containsKey('price'), false);
    });
  });
}
