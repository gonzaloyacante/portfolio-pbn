import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/projects/data/project_model.dart';

void main() {
  // ── ProjectCategory ────────────────────────────────────────────────────

  group('ProjectCategory', () {
    const cat = ProjectCategory(id: 'c1', name: 'Arte', slug: 'arte');

    test('stores id', () => expect(cat.id, 'c1'));
    test('stores name', () => expect(cat.name, 'Arte'));
    test('stores slug', () => expect(cat.slug, 'arte'));

    test('equality — same values equal', () {
      const c2 = ProjectCategory(id: 'c1', name: 'Arte', slug: 'arte');
      expect(cat, equals(c2));
    });

    test('equality — different id not equal', () {
      const c2 = ProjectCategory(id: 'c2', name: 'Arte', slug: 'arte');
      expect(cat, isNot(equals(c2)));
    });

    test('copyWith updates name', () {
      final updated = cat.copyWith(name: 'Diseño');
      expect(updated.name, 'Diseño');
      expect(updated.id, 'c1');
    });
  });

  // ── ProjectImage ───────────────────────────────────────────────────────

  group('ProjectImage', () {
    const img = ProjectImage(id: 'i1', imageUrl: 'https://example.com/img.jpg');

    test('stores id', () => expect(img.id, 'i1'));
    test(
      'stores imageUrl',
      () => expect(img.imageUrl, 'https://example.com/img.jpg'),
    );
    test('altText defaults to null', () => expect(img.altText, isNull));
    test('sortOrder defaults to 0', () => expect(img.sortOrder, 0));

    test('stores custom altText', () {
      const i = ProjectImage(id: 'i2', imageUrl: 'url', altText: 'Alt text');
      expect(i.altText, 'Alt text');
    });

    test('stores custom sortOrder', () {
      const i = ProjectImage(id: 'i2', imageUrl: 'url', sortOrder: 3);
      expect(i.sortOrder, 3);
    });
  });

  // ── ProjectListItem ────────────────────────────────────────────────────

  group('ProjectListItem — defaults', () {
    const cat = ProjectCategory(id: 'c1', name: 'Arte', slug: 'arte');
    const item = ProjectListItem(
      id: 'p1',
      title: 'My Project',
      slug: 'my-project',
      date: '2024-01-01',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: cat,
    );

    test('stores id', () => expect(item.id, 'p1'));
    test('stores title', () => expect(item.title, 'My Project'));
    test('stores slug', () => expect(item.slug, 'my-project'));
    test('sortOrder defaults to 0', () => expect(item.sortOrder, 0));
    test('isFeatured defaults to false', () => expect(item.isFeatured, false));
    test('isPinned defaults to false', () => expect(item.isPinned, false));
    test('isActive defaults to true', () => expect(item.isActive, true));
    test('viewCount defaults to 0', () => expect(item.viewCount, 0));
    test('excerpt defaults to null', () => expect(item.excerpt, isNull));
    test(
      'thumbnailUrl defaults to null',
      () => expect(item.thumbnailUrl, isNull),
    );
    test('stores category', () => expect(item.category, cat));
  });

  group('ProjectListItem — copyWith', () {
    const cat = ProjectCategory(id: 'c1', name: 'Arte', slug: 'arte');
    const item = ProjectListItem(
      id: 'p1',
      title: 'My Project',
      slug: 'my-project',
      date: '2024-01-01',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: cat,
    );

    test('copyWith updates isFeatured', () {
      final updated = item.copyWith(isFeatured: true);
      expect(updated.isFeatured, true);
    });

    test('copyWith preserves other fields', () {
      final updated = item.copyWith(sortOrder: 5);
      expect(updated.id, 'p1');
      expect(updated.title, 'My Project');
    });
  });

  // ── ProjectDetail ──────────────────────────────────────────────────────

  group('ProjectDetail — defaults', () {
    const cat = ProjectCategory(id: 'c1', name: 'Arte', slug: 'arte');
    const detail = ProjectDetail(
      id: 'p1',
      title: 'Project',
      slug: 'project',
      description: 'A description',
      date: '2024-01-01',
      categoryId: 'c1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: cat,
    );

    test('stores id', () => expect(detail.id, 'p1'));
    test('tags defaults to empty list', () => expect(detail.tags, isEmpty));
    test('images defaults to empty list', () => expect(detail.images, isEmpty));
    test(
      'metaKeywords defaults to empty list',
      () => expect(detail.metaKeywords, isEmpty),
    );
    test(
      'isFeatured defaults to false',
      () => expect(detail.isFeatured, false),
    );
    test('isPinned defaults to false', () => expect(detail.isPinned, false));
    test('isActive defaults to true', () => expect(detail.isActive, true));
    test('likeCount defaults to 0', () => expect(detail.likeCount, 0));
    test('videoUrl defaults to null', () => expect(detail.videoUrl, isNull));
  });

  group('ProjectDetail — with images', () {
    const cat = ProjectCategory(id: 'c1', name: 'Arte', slug: 'arte');
    const img = ProjectImage(id: 'i1', imageUrl: 'url');

    const detail = ProjectDetail(
      id: 'p1',
      title: 'Project',
      slug: 'project',
      description: 'Desc',
      date: '2024-01-01',
      categoryId: 'c1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      category: cat,
      images: [img],
    );

    test('stores images', () => expect(detail.images.length, 1));
    test(
      'stores first image correctly',
      () => expect(detail.images.first, img),
    );
  });

  // ── ProjectFormData ────────────────────────────────────────────────────

  group('ProjectFormData', () {
    test('defaults all fields to empty/false', () {
      final form = ProjectFormData();
      expect(form.title, '');
      expect(form.slug, '');
      expect(form.description, '');
      expect(form.categoryId, '');
      expect(form.tags, isEmpty);
      expect(form.isFeatured, false);
      expect(form.isPinned, false);
    });

    test('stores provided values', () {
      final form = ProjectFormData(
        title: 'My Project',
        slug: 'my-project',
        description: 'Desc',
        categoryId: 'c1',
        isFeatured: true,
        tags: ['tag1', 'tag2'],
      );
      expect(form.title, 'My Project');
      expect(form.isFeatured, true);
      expect(form.tags, ['tag1', 'tag2']);
    });

    test('toJson includes required fields', () {
      final form = ProjectFormData(
        title: 'T',
        slug: 's',
        description: 'D',
        categoryId: 'c1',
      );
      final json = form.toJson();
      expect(json['title'], 'T');
      expect(json['slug'], 's');
      expect(json['description'], 'D');
      expect(json['categoryId'], 'c1');
      expect(json.containsKey('isFeatured'), true);
      expect(json.containsKey('isPinned'), true);
    });

    test('toJson omits null optional fields', () {
      final form = ProjectFormData(title: 'T', slug: 's', description: 'D');
      final json = form.toJson();
      expect(json.containsKey('excerpt'), false);
      expect(json.containsKey('videoUrl'), false);
      expect(json.containsKey('metaTitle'), false);
    });
  });
}
