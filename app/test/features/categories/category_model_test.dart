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
      'coverImageUrl defaults to null',
      () => expect(item.coverImageUrl, isNull),
    );
    test('sortOrder defaults to 0', () => expect(item.sortOrder, 0));
    test('isActive defaults to true', () => expect(item.isActive, true));
  });

  group('CategoryItem — with optional fields', () {
    const item = CategoryItem(
      id: 'c2',
      name: 'Diseño',
      slug: 'diseno',
      description: 'Diseño gráfico',
      sortOrder: 2,
      isActive: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    );

    test(
      'stores description',
      () => expect(item.description, 'Diseño gráfico'),
    );
    test('stores sortOrder', () => expect(item.sortOrder, 2));
    test('stores isActive=false', () => expect(item.isActive, false));
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
      'coverImageUrl defaults to null',
      () => expect(detail.coverImageUrl, isNull),
    );
  });

  // SEO fields (metaTitle, metaDescription, metaKeywords, ogImage) were removed
  // from the Category DB schema in March 2026 — no longer part of CategoryDetail.
}
