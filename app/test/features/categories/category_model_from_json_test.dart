import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/categories/data/category_model.dart';

void main() {
  // ── CategoryItem fromJson ─────────────────────────────────────────────────

  group('CategoryItem.fromJson — required fields', () {
    Map<String, dynamic> base0() => {
      'id': 'cat-1',
      'name': 'Bodas',
      'slug': 'bodas',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('parses id', () => expect(CategoryItem.fromJson(base0()).id, 'cat-1'));
    test(
      'parses name',
      () => expect(CategoryItem.fromJson(base0()).name, 'Bodas'),
    );
    test(
      'parses slug',
      () => expect(CategoryItem.fromJson(base0()).slug, 'bodas'),
    );
    test(
      'createdAt is String',
      () => expect(
        CategoryItem.fromJson(base0()).createdAt,
        '2024-01-01T00:00:00Z',
      ),
    );
  });

  group('CategoryItem.fromJson — defaults', () {
    final base = {
      'id': 'cat-1',
      'name': 'Test',
      'slug': 'test',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'sortOrder defaults to 0',
      () => expect(CategoryItem.fromJson(base).sortOrder, 0),
    );
    test(
      'isActive defaults to true',
      () => expect(CategoryItem.fromJson(base).isActive, isTrue),
    );
    test(
      'description is null',
      () => expect(CategoryItem.fromJson(base).description, isNull),
    );
    test(
      'coverImageUrl is null',
      () => expect(CategoryItem.fromJson(base).coverImageUrl, isNull),
    );
  });

  group('CategoryItem.fromJson — optional fields', () {
    Map<String, dynamic> full() => {
      'id': 'cat-2',
      'name': 'Maternidad',
      'slug': 'maternidad',
      'description': 'Sesiones de maternidad',
      'coverImageUrl': 'https://x.com/thumb.jpg',
      'sortOrder': 5,
      'isActive': false,
      'viewCount': 340,
      'createdAt': '2024-02-01T00:00:00Z',
      'updatedAt': '2024-02-15T00:00:00Z',
    };

    test(
      'parses description',
      () => expect(
        CategoryItem.fromJson(full()).description,
        'Sesiones de maternidad',
      ),
    );
    test(
      'parses coverImageUrl',
      () => expect(
        CategoryItem.fromJson(full()).coverImageUrl,
        'https://x.com/thumb.jpg',
      ),
    );
    test(
      'parses sortOrder',
      () => expect(CategoryItem.fromJson(full()).sortOrder, 5),
    );
    test(
      'parses isActive = false',
      () => expect(CategoryItem.fromJson(full()).isActive, isFalse),
    );
  });

  group('CategoryItem — equality and copyWith', () {
    final base = {
      'id': 'cat-1',
      'name': 'Test',
      'slug': 'test',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('two equal instances', () {
      expect(CategoryItem.fromJson(base), CategoryItem.fromJson(base));
    });

    test('copyWith name', () {
      final c = CategoryItem.fromJson(base);
      expect(c.copyWith(name: 'Updated').name, 'Updated');
    });

    test('copyWith isActive', () {
      final c = CategoryItem.fromJson(base);
      expect(c.copyWith(isActive: false).isActive, isFalse);
    });
  });

  // ── CategoryDetail fromJson ───────────────────────────────────────────────

  group('CategoryDetail.fromJson — required fields', () {
    Map<String, dynamic> base0() => {
      'id': 'cd-1',
      'name': 'Boudoir',
      'slug': 'boudoir',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'parses id',
      () => expect(CategoryDetail.fromJson(base0()).id, 'cd-1'),
    );
    test(
      'parses name',
      () => expect(CategoryDetail.fromJson(base0()).name, 'Boudoir'),
    );
    test(
      'parses slug',
      () => expect(CategoryDetail.fromJson(base0()).slug, 'boudoir'),
    );
  });

  group('CategoryDetail.fromJson — defaults', () {
    final base = {
      'id': 'cd-1',
      'name': 'Test',
      'slug': 'test',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'isActive defaults to true',
      () => expect(CategoryDetail.fromJson(base).isActive, isTrue),
    );
    test(
      'coverImageUrl is null',
      () => expect(CategoryDetail.fromJson(base).coverImageUrl, isNull),
    );
    // SEO fields removed from DB schema (March 2026) — not expected in API responses
  });

  group('CategoryDetail.fromJson — optional fields', () {
    Map<String, dynamic> full() => {
      'id': 'cd-2',
      'name': 'Estudio',
      'slug': 'estudio',
      'description': 'Sesiones en estudio',
      'coverImageUrl': 'https://x.com/cover.jpg',
      'metaTitle': 'Estudio - SEO',
      'metaDescription': 'Meta desc',
      'metaKeywords': ['estudio', 'foto'],
      'ogImage': 'https://x.com/og.jpg',
      'sortOrder': 3,
      'viewCount': 200,
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'parses description',
      () => expect(
        CategoryDetail.fromJson(full()).description,
        'Sesiones en estudio',
      ),
    );
    test(
      'parses coverImageUrl',
      () => expect(
        CategoryDetail.fromJson(full()).coverImageUrl,
        'https://x.com/cover.jpg',
      ),
    );
    // SEO fields (metaTitle, metaKeywords, ogImage) removed from DB — not parsed
    test(
      'parses sortOrder',
      () => expect(CategoryDetail.fromJson(full()).sortOrder, 3),
    );
  });

  // ── CategoryFormData ──────────────────────────────────────────────────────

  group('CategoryFormData.toJson', () {
    test('required fields in json', () {
      final j = const CategoryFormData(name: 'Bodas', slug: 'bodas').toJson();
      expect(j['name'], 'Bodas');
      expect(j['slug'], 'bodas');
    });
    test('isActive defaults to true', () {
      expect(
        const CategoryFormData(name: 'T', slug: 't').toJson()['isActive'],
        isTrue,
      );
    });
    test('null optional fields not present', () {
      final j = const CategoryFormData(name: 'T', slug: 't').toJson();
      expect(j.containsKey('description'), isFalse);
      expect(j.containsKey('coverImageUrl'), isFalse);
    });
  });
}
