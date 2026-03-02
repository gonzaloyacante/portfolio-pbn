import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/services/data/service_model.dart';

void main() {
  // ── ServiceItem fromJson ──────────────────────────────────────────────────

  group('ServiceItem.fromJson — required fields', () {
    Map<String, dynamic> base0() => {
      'id': 's1',
      'name': 'Maquillaje de novia',
      'slug': 'maquillaje-novia',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('parses id', () => expect(ServiceItem.fromJson(base0()).id, 's1'));
    test(
      'parses name',
      () => expect(ServiceItem.fromJson(base0()).name, 'Maquillaje de novia'),
    );
    test(
      'parses slug',
      () => expect(ServiceItem.fromJson(base0()).slug, 'maquillaje-novia'),
    );
    test(
      'createdAt is String',
      () => expect(
        ServiceItem.fromJson(base0()).createdAt,
        '2024-01-01T00:00:00Z',
      ),
    );
  });

  group('ServiceItem.fromJson — defaults', () {
    final base = {
      'id': 's1',
      'name': 'Test',
      'slug': 'test',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'currency defaults to "EUR"',
      () => expect(ServiceItem.fromJson(base).currency, 'EUR'),
    );
    test(
      'isActive defaults to true',
      () => expect(ServiceItem.fromJson(base).isActive, isTrue),
    );
    test(
      'isFeatured defaults to false',
      () => expect(ServiceItem.fromJson(base).isFeatured, isFalse),
    );
    test(
      'isAvailable defaults to true',
      () => expect(ServiceItem.fromJson(base).isAvailable, isTrue),
    );
    test(
      'sortOrder defaults to 0',
      () => expect(ServiceItem.fromJson(base).sortOrder, 0),
    );
    test(
      'bookingCount defaults to 0',
      () => expect(ServiceItem.fromJson(base).bookingCount, 0),
    );
    test(
      'viewCount defaults to 0',
      () => expect(ServiceItem.fromJson(base).viewCount, 0),
    );
    test(
      'shortDesc is null',
      () => expect(ServiceItem.fromJson(base).shortDesc, isNull),
    );
    test(
      'price is null',
      () => expect(ServiceItem.fromJson(base).price, isNull),
    );
    test(
      'priceLabel is null',
      () => expect(ServiceItem.fromJson(base).priceLabel, isNull),
    );
    test(
      'duration is null',
      () => expect(ServiceItem.fromJson(base).duration, isNull),
    );
    test(
      'imageUrl is null',
      () => expect(ServiceItem.fromJson(base).imageUrl, isNull),
    );
    test(
      'iconName is null',
      () => expect(ServiceItem.fromJson(base).iconName, isNull),
    );
    test(
      'color is null',
      () => expect(ServiceItem.fromJson(base).color, isNull),
    );
  });

  group('ServiceItem.fromJson — optional fields', () {
    Map<String, dynamic> full() => {
      'id': 's2',
      'name': 'Maquillaje artístico',
      'slug': 'maquillaje-artistico',
      'shortDesc': 'Maquillaje especial',
      'price': '150',
      'priceLabel': 'desde',
      'currency': 'USD',
      'duration': '2 horas',
      'imageUrl': 'https://x.com/img.jpg',
      'iconName': 'brush',
      'color': '#FF5733',
      'isActive': false,
      'isFeatured': true,
      'isAvailable': false,
      'sortOrder': 3,
      'bookingCount': 12,
      'viewCount': 100,
      'createdAt': '2024-02-01T00:00:00Z',
      'updatedAt': '2024-02-15T00:00:00Z',
    };

    test(
      'parses shortDesc',
      () =>
          expect(ServiceItem.fromJson(full()).shortDesc, 'Maquillaje especial'),
    );
    test(
      'parses price',
      () => expect(ServiceItem.fromJson(full()).price, '150'),
    );
    test(
      'parses priceLabel',
      () => expect(ServiceItem.fromJson(full()).priceLabel, 'desde'),
    );
    test(
      'parses currency',
      () => expect(ServiceItem.fromJson(full()).currency, 'USD'),
    );
    test(
      'parses duration',
      () => expect(ServiceItem.fromJson(full()).duration, '2 horas'),
    );
    test(
      'parses imageUrl',
      () => expect(
        ServiceItem.fromJson(full()).imageUrl,
        'https://x.com/img.jpg',
      ),
    );
    test(
      'parses iconName',
      () => expect(ServiceItem.fromJson(full()).iconName, 'brush'),
    );
    test(
      'parses color',
      () => expect(ServiceItem.fromJson(full()).color, '#FF5733'),
    );
    test(
      'parses isActive = false',
      () => expect(ServiceItem.fromJson(full()).isActive, isFalse),
    );
    test(
      'parses isFeatured = true',
      () => expect(ServiceItem.fromJson(full()).isFeatured, isTrue),
    );
    test(
      'parses isAvailable = false',
      () => expect(ServiceItem.fromJson(full()).isAvailable, isFalse),
    );
    test(
      'parses sortOrder',
      () => expect(ServiceItem.fromJson(full()).sortOrder, 3),
    );
    test(
      'parses bookingCount',
      () => expect(ServiceItem.fromJson(full()).bookingCount, 12),
    );
    test(
      'parses viewCount',
      () => expect(ServiceItem.fromJson(full()).viewCount, 100),
    );
  });

  group('ServiceItem — equality and copyWith', () {
    final base = {
      'id': 's1',
      'name': 'Test',
      'slug': 'test',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('two equal instances', () {
      expect(ServiceItem.fromJson(base), ServiceItem.fromJson(base));
    });

    test('copyWith name', () {
      final s = ServiceItem.fromJson(base);
      expect(s.copyWith(name: 'Nuevo').name, 'Nuevo');
    });

    test('copyWith isActive', () {
      final s = ServiceItem.fromJson(base);
      expect(s.copyWith(isActive: false).isActive, isFalse);
    });
  });

  // ── ServiceDetail fromJson ────────────────────────────────────────────────

  group('ServiceDetail.fromJson — required fields', () {
    Map<String, dynamic> base0() => {
      'id': 'sd1',
      'name': 'Servicio Completo',
      'slug': 'servicio-completo',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('parses id', () => expect(ServiceDetail.fromJson(base0()).id, 'sd1'));
    test(
      'parses name',
      () => expect(ServiceDetail.fromJson(base0()).name, 'Servicio Completo'),
    );
    test(
      'parses slug',
      () => expect(ServiceDetail.fromJson(base0()).slug, 'servicio-completo'),
    );
  });

  group('ServiceDetail.fromJson — defaults', () {
    final base = {
      'id': 'sd1',
      'name': 'Test',
      'slug': 'test',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'metaKeywords defaults to empty',
      () => expect(ServiceDetail.fromJson(base).metaKeywords, isEmpty),
    );
    test(
      'isActive defaults to true',
      () => expect(ServiceDetail.fromJson(base).isActive, isTrue),
    );
    test(
      'isFeatured defaults to false',
      () => expect(ServiceDetail.fromJson(base).isFeatured, isFalse),
    );
    test(
      'description is null',
      () => expect(ServiceDetail.fromJson(base).description, isNull),
    );
    test(
      'metaTitle is null',
      () => expect(ServiceDetail.fromJson(base).metaTitle, isNull),
    );
    test(
      'metaDescription is null',
      () => expect(ServiceDetail.fromJson(base).metaDescription, isNull),
    );
    test(
      'maxBookingsPerDay is null',
      () => expect(ServiceDetail.fromJson(base).maxBookingsPerDay, isNull),
    );
    test(
      'advanceNoticeDays is null',
      () => expect(ServiceDetail.fromJson(base).advanceNoticeDays, isNull),
    );
  });

  group('ServiceDetail.fromJson — optional fields', () {
    Map<String, dynamic> full() => {
      'id': 'sd2',
      'name': 'Completo Detalle',
      'slug': 'completo-detalle',
      'description': 'Descripción larga',
      'durationMinutes': 120,
      'maxBookingsPerDay': 3,
      'advanceNoticeDays': 2,
      'metaTitle': 'SEO Title',
      'metaDescription': 'SEO Desc',
      'metaKeywords': ['makeup', 'novia'],
      'requirements': 'Traer fotos de referencia',
      'cancellationPolicy': '48h previas',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'parses description',
      () => expect(
        ServiceDetail.fromJson(full()).description,
        'Descripción larga',
      ),
    );
    test(
      'parses durationMinutes',
      () => expect(ServiceDetail.fromJson(full()).durationMinutes, 120),
    );
    test(
      'parses maxBookingsPerDay',
      () => expect(ServiceDetail.fromJson(full()).maxBookingsPerDay, 3),
    );
    test(
      'parses advanceNoticeDays',
      () => expect(ServiceDetail.fromJson(full()).advanceNoticeDays, 2),
    );
    test(
      'parses metaTitle',
      () => expect(ServiceDetail.fromJson(full()).metaTitle, 'SEO Title'),
    );
    test(
      'parses metaKeywords',
      () => expect(ServiceDetail.fromJson(full()).metaKeywords, [
        'makeup',
        'novia',
      ]),
    );
    test(
      'parses requirements',
      () => expect(
        ServiceDetail.fromJson(full()).requirements,
        'Traer fotos de referencia',
      ),
    );
    test(
      'parses cancellationPolicy',
      () => expect(
        ServiceDetail.fromJson(full()).cancellationPolicy,
        '48h previas',
      ),
    );
  });

  // ── ServiceFormData ───────────────────────────────────────────────────────

  group('ServiceFormData.toJson', () {
    test('required fields present', () {
      final f = ServiceFormData(name: 'Test', slug: 'test');
      final j = f.toJson();
      expect(j['name'], 'Test');
      expect(j['slug'], 'test');
    });
    test('defaults: priceLabel = "desde"', () {
      expect(
        ServiceFormData(name: 'T', slug: 't').toJson()['priceLabel'],
        'desde',
      );
    });
    test('defaults: currency = "EUR"', () {
      expect(ServiceFormData(name: 'T', slug: 't').toJson()['currency'], 'EUR');
    });
    test('null optionals not present in json', () {
      final j = ServiceFormData(name: 'T', slug: 't').toJson();
      expect(j.containsKey('description'), isFalse);
      expect(j.containsKey('imageUrl'), isFalse);
    });
    test('description present when set', () {
      final j = ServiceFormData(
        name: 'T',
        slug: 't',
        description: 'Desc',
      ).toJson();
      expect(j['description'], 'Desc');
    });
  });
}
