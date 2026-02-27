import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/categories/data/category_model.dart';

void main() {
  // ── CategoryItem fromJson ─────────────────────────────────────────────────

  group('CategoryItem.fromJson — required fields', () {
    Map<String, dynamic> _base() => {
      'id': 'cat-1',
      'name': 'Bodas',
      'slug': 'bodas',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test('parses id', () => expect(CategoryItem.fromJson(_base()).id, 'cat-1'));
    test(
      'parses name',
      () => expect(CategoryItem.fromJson(_base()).name, 'Bodas'),
    );
    test(
      'parses slug',
      () => expect(CategoryItem.fromJson(_base()).slug, 'bodas'),
    );
    test(
      'createdAt is String',
      () => expect(
        CategoryItem.fromJson(_base()).createdAt,
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
      'projectCount defaults to 0',
      () => expect(CategoryItem.fromJson(base).projectCount, 0),
    );
    test(
      'viewCount defaults to 0',
      () => expect(CategoryItem.fromJson(base).viewCount, 0),
    );
    test(
      'description is null',
      () => expect(CategoryItem.fromJson(base).description, isNull),
    );
    test(
      'thumbnailUrl is null',
      () => expect(CategoryItem.fromJson(base).thumbnailUrl, isNull),
    );
    test(
      'iconName is null',
      () => expect(CategoryItem.fromJson(base).iconName, isNull),
    );
    test(
      'color is null',
      () => expect(CategoryItem.fromJson(base).color, isNull),
    );
  });

  group('CategoryItem.fromJson — optional fields', () {
    Map<String, dynamic> _full() => {
      'id': 'cat-2',
      'name': 'Maternidad',
      'slug': 'maternidad',
      'description': 'Sesiones de maternidad',
      'thumbnailUrl': 'https://x.com/thumb.jpg',
      'iconName': 'baby',
      'color': '#FFD700',
      'sortOrder': 5,
      'isActive': false,
      'projectCount': 12,
      'viewCount': 340,
      'createdAt': '2024-02-01T00:00:00Z',
      'updatedAt': '2024-02-15T00:00:00Z',
    };

    test(
      'parses description',
      () => expect(
        CategoryItem.fromJson(_full()).description,
        'Sesiones de maternidad',
      ),
    );
    test(
      'parses thumbnailUrl',
      () => expect(
        CategoryItem.fromJson(_full()).thumbnailUrl,
        'https://x.com/thumb.jpg',
      ),
    );
    test(
      'parses iconName',
      () => expect(CategoryItem.fromJson(_full()).iconName, 'baby'),
    );
    test(
      'parses color',
      () => expect(CategoryItem.fromJson(_full()).color, '#FFD700'),
    );
    test(
      'parses sortOrder',
      () => expect(CategoryItem.fromJson(_full()).sortOrder, 5),
    );
    test(
      'parses isActive = false',
      () => expect(CategoryItem.fromJson(_full()).isActive, isFalse),
    );
    test(
      'parses projectCount',
      () => expect(CategoryItem.fromJson(_full()).projectCount, 12),
    );
    test(
      'parses viewCount',
      () => expect(CategoryItem.fromJson(_full()).viewCount, 340),
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
    Map<String, dynamic> _base() => {
      'id': 'cd-1',
      'name': 'Boudoir',
      'slug': 'boudoir',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'parses id',
      () => expect(CategoryDetail.fromJson(_base()).id, 'cd-1'),
    );
    test(
      'parses name',
      () => expect(CategoryDetail.fromJson(_base()).name, 'Boudoir'),
    );
    test(
      'parses slug',
      () => expect(CategoryDetail.fromJson(_base()).slug, 'boudoir'),
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
      'metaKeywords defaults to empty',
      () => expect(CategoryDetail.fromJson(base).metaKeywords, isEmpty),
    );
    test(
      'isActive defaults to true',
      () => expect(CategoryDetail.fromJson(base).isActive, isTrue),
    );
    test(
      'coverImageUrl is null',
      () => expect(CategoryDetail.fromJson(base).coverImageUrl, isNull),
    );
    test(
      'metaTitle is null',
      () => expect(CategoryDetail.fromJson(base).metaTitle, isNull),
    );
    test(
      'metaDescription is null',
      () => expect(CategoryDetail.fromJson(base).metaDescription, isNull),
    );
    test(
      'ogImage is null',
      () => expect(CategoryDetail.fromJson(base).ogImage, isNull),
    );
  });

  group('CategoryDetail.fromJson — optional fields', () {
    Map<String, dynamic> _full() => {
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
      'projectCount': 8,
      'viewCount': 200,
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
    };

    test(
      'parses description',
      () => expect(
        CategoryDetail.fromJson(_full()).description,
        'Sesiones en estudio',
      ),
    );
    test(
      'parses coverImageUrl',
      () => expect(
        CategoryDetail.fromJson(_full()).coverImageUrl,
        'https://x.com/cover.jpg',
      ),
    );
    test(
      'parses metaTitle',
      () => expect(CategoryDetail.fromJson(_full()).metaTitle, 'Estudio - SEO'),
    );
    test(
      'parses metaKeywords',
      () => expect(CategoryDetail.fromJson(_full()).metaKeywords, [
        'estudio',
        'foto',
      ]),
    );
    test(
      'parses ogImage',
      () => expect(
        CategoryDetail.fromJson(_full()).ogImage,
        'https://x.com/og.jpg',
      ),
    );
    test(
      'parses sortOrder',
      () => expect(CategoryDetail.fromJson(_full()).sortOrder, 3),
    );
    test(
      'parses projectCount',
      () => expect(CategoryDetail.fromJson(_full()).projectCount, 8),
    );
  });

  // ── CategoryFormData ──────────────────────────────────────────────────────

  group('CategoryFormData.toJson', () {
    test('required fields in json', () {
      final j = CategoryFormData(name: 'Bodas', slug: 'bodas').toJson();
      expect(j['name'], 'Bodas');
      expect(j['slug'], 'bodas');
    });
    test('isActive defaults to true', () {
      expect(
        CategoryFormData(name: 'T', slug: 't').toJson()['isActive'],
        isTrue,
      );
    });
    test('null optional fields not present', () {
      final j = CategoryFormData(name: 'T', slug: 't').toJson();
      expect(j.containsKey('description'), isFalse);
      expect(j.containsKey('thumbnailUrl'), isFalse);
      expect(j.containsKey('iconName'), isFalse);
      expect(j.containsKey('color'), isFalse);
    });
    test('optional fields present when set', () {
      final j = CategoryFormData(
        name: 'T',
        slug: 't',
        color: '#f00',
        iconName: 'star',
      ).toJson();
      expect(j['color'], '#f00');
      expect(j['iconName'], 'star');
    });
  });
}
