import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/categories/data/category_model.dart';

void main() {
  // ── CategoryItem ────────────────────────────────────────────────────────

  group('CategoryItem — construction', () {
    const item = CategoryItem(
      id: 'c1',
      name: 'Arte',
      slug: 'arte',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    );

    test('stores id', () => expect(item.id, 'c1'));
    test('stores name', () => expect(item.name, 'Arte'));
    test('stores slug', () => expect(item.slug, 'arte'));
    test(
      'description defaults to null',
      () => expect(item.description, isNull),
    );
    test(
      'thumbnailUrl defaults to null',
      () => expect(item.thumbnailUrl, isNull),
    );
    test('iconName defaults to null', () => expect(item.iconName, isNull));
    test('color defaults to null', () => expect(item.color, isNull));
    test('sortOrder defaults to 0', () => expect(item.sortOrder, 0));
    test('isActive defaults to true', () => expect(item.isActive, true));
    test('projectCount defaults to 0', () => expect(item.projectCount, 0));
    test('viewCount defaults to 0', () => expect(item.viewCount, 0));
  });

  group('CategoryItem — with optional fields', () {
    const item = CategoryItem(
      id: 'c2',
      name: 'Diseño',
      slug: 'diseno',
      description: 'Diseño gráfico',
      iconName: 'palette',
      color: '#FF0000',
      sortOrder: 2,
      isActive: false,
      projectCount: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    );

    test(
      'stores description',
      () => expect(item.description, 'Diseño gráfico'),
    );
    test('stores iconName', () => expect(item.iconName, 'palette'));
    test('stores color', () => expect(item.color, '#FF0000'));
    test('stores sortOrder', () => expect(item.sortOrder, 2));
    test('stores isActive=false', () => expect(item.isActive, false));
    test('stores projectCount', () => expect(item.projectCount, 5));
  });

  group('CategoryItem — equality', () {
    const m = '2024-01-01T00:00:00Z';
    const a = CategoryItem(
      id: 'c1',
      name: 'Arte',
      slug: 'arte',
      createdAt: m,
      updatedAt: m,
    );
    const b = CategoryItem(
      id: 'c1',
      name: 'Arte',
      slug: 'arte',
      createdAt: m,
      updatedAt: m,
    );

    test('same values are equal', () => expect(a, equals(b)));
    test('different id makes not equal', () {
      const c = CategoryItem(
        id: 'c2',
        name: 'Arte',
        slug: 'arte',
        createdAt: m,
        updatedAt: m,
      );
      expect(a, isNot(equals(c)));
    });
  });

  group('CategoryItem — copyWith', () {
    const m = '2024-01-01T00:00:00Z';
    const item = CategoryItem(
      id: 'c1',
      name: 'Arte',
      slug: 'arte',
      createdAt: m,
      updatedAt: m,
    );

    test('copyWith updates name', () {
      final updated = item.copyWith(name: 'Fotografía');
      expect(updated.name, 'Fotografía');
      expect(updated.id, 'c1');
    });

    test('copyWith updates sortOrder', () {
      final updated = item.copyWith(sortOrder: 10);
      expect(updated.sortOrder, 10);
    });
  });

  // ── CategoryDetail ──────────────────────────────────────────────────────

  group('CategoryDetail — construction', () {
    const detail = CategoryDetail(
      id: 'c1',
      name: 'Arte',
      slug: 'arte',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    );

    test('stores id', () => expect(detail.id, 'c1'));
    test(
      'metaKeywords defaults to empty list',
      () => expect(detail.metaKeywords, isEmpty),
    );
    test(
      'coverImageUrl defaults to null',
      () => expect(detail.coverImageUrl, isNull),
    );
    test('metaTitle defaults to null', () => expect(detail.metaTitle, isNull));
    test(
      'metaDescription defaults to null',
      () => expect(detail.metaDescription, isNull),
    );
    test('ogImage defaults to null', () => expect(detail.ogImage, isNull));
  });

  group('CategoryDetail — with SEO fields', () {
    const detail = CategoryDetail(
      id: 'c1',
      name: 'Arte',
      slug: 'arte',
      metaTitle: 'Arte - Portfolio',
      metaDescription: 'Trabajos de arte',
      metaKeywords: ['arte', 'pintura'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    );

    test(
      'stores metaTitle',
      () => expect(detail.metaTitle, 'Arte - Portfolio'),
    );
    test(
      'stores metaDescription',
      () => expect(detail.metaDescription, 'Trabajos de arte'),
    );
    test(
      'stores metaKeywords',
      () => expect(detail.metaKeywords, ['arte', 'pintura']),
    );
  });
}
