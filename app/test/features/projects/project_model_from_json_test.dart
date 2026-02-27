import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/projects/data/project_model.dart';

void main() {
  // ── ProjectCategory fromJson ───────────────────────────────────────────────

  group('ProjectCategory.fromJson', () {
    test('parses required fields', () {
      final category = ProjectCategory.fromJson({
        'id': 'cat-1',
        'name': 'Photography',
        'slug': 'photography',
      });
      expect(category.id, 'cat-1');
      expect(category.name, 'Photography');
      expect(category.slug, 'photography');
    });

    test('toJson round-trips correctly', () {
      const cat = ProjectCategory(id: 'c1', name: 'Art', slug: 'art');
      final json = cat.toJson();
      final restored = ProjectCategory.fromJson(json);
      expect(restored, cat);
    });

    test('equality holds for same values', () {
      const a = ProjectCategory(id: 'x', name: 'X', slug: 'x');
      const b = ProjectCategory(id: 'x', name: 'X', slug: 'x');
      expect(a, b);
    });

    test('copyWith changes only specified fields', () {
      const cat = ProjectCategory(id: 'c1', name: 'First', slug: 'first');
      final updated = cat.copyWith(name: 'Updated');
      expect(updated.id, 'c1');
      expect(updated.name, 'Updated');
      expect(updated.slug, 'first');
    });

    test('copyWith returns different instance on change', () {
      const cat = ProjectCategory(id: 'c1', name: 'First', slug: 'first');
      final updated = cat.copyWith(name: 'New');
      expect(updated, isNot(cat));
    });
  });

  // ── ProjectImage fromJson ─────────────────────────────────────────────────

  group('ProjectImage.fromJson', () {
    test('parses url field correctly (JsonKey name: url)', () {
      final img = ProjectImage.fromJson({
        'id': 'img-1',
        'url': 'https://example.com/img.jpg',
        'alt': 'My alt',
        'order': 2,
      });
      expect(img.id, 'img-1');
      expect(img.imageUrl, 'https://example.com/img.jpg');
      expect(img.altText, 'My alt');
      expect(img.sortOrder, 2);
    });

    test('defaults sortOrder to 0 when order omitted', () {
      final img = ProjectImage.fromJson({
        'id': 'img-2',
        'url': 'https://example.com/img2.jpg',
      });
      expect(img.sortOrder, 0);
    });

    test('altText is null when not provided', () {
      final img = ProjectImage.fromJson({
        'id': 'img-3',
        'url': 'https://example.com/img3.jpg',
      });
      expect(img.altText, isNull);
    });

    test('toJson uses "url" key not "imageUrl"', () {
      const img = ProjectImage(id: 'i1', imageUrl: 'https://x.com/a.jpg');
      final json = img.toJson();
      expect(json.containsKey('url'), isTrue);
      expect(json['url'], 'https://x.com/a.jpg');
    });

    test('toJson uses "alt" key not "altText"', () {
      const img = ProjectImage(id: 'i1', imageUrl: 'url', altText: 'myalt');
      final json = img.toJson();
      expect(json.containsKey('alt'), isTrue);
      expect(json['alt'], 'myalt');
    });

    test('toJson uses "order" key not "sortOrder"', () {
      const img = ProjectImage(id: 'i1', imageUrl: 'url', sortOrder: 3);
      final json = img.toJson();
      expect(json.containsKey('order'), isTrue);
      expect(json['order'], 3);
    });

    test('round-trip preserves all values', () {
      const img = ProjectImage(
        id: 'x',
        imageUrl: 'https://a.com',
        altText: 'alt',
        sortOrder: 5,
      );
      final json = img.toJson();
      final restored = ProjectImage.fromJson(json);
      expect(restored, img);
    });
  });

  // ── ProjectListItem fromJson ──────────────────────────────────────────────

  group('ProjectListItem.fromJson', () {
    Map<String, dynamic> _minimal() => {
      'id': 'p1',
      'title': 'My Project',
      'slug': 'my-project',
      'date': '2024-01-01',
      'createdAt': '2024-01-01T00:00:00Z',
      'updatedAt': '2024-01-01T00:00:00Z',
      'category': {'id': 'c1', 'name': 'Art', 'slug': 'art'},
    };

    test('parses minimal JSON', () {
      final item = ProjectListItem.fromJson(_minimal());
      expect(item.id, 'p1');
      expect(item.title, 'My Project');
      expect(item.slug, 'my-project');
    });

    test('defaults sortOrder to 0', () {
      final item = ProjectListItem.fromJson(_minimal());
      expect(item.sortOrder, 0);
    });

    test('defaults isFeatured to false', () {
      final item = ProjectListItem.fromJson(_minimal());
      expect(item.isFeatured, isFalse);
    });

    test('defaults isPinned to false', () {
      final item = ProjectListItem.fromJson(_minimal());
      expect(item.isPinned, isFalse);
    });

    test('defaults isActive to true', () {
      final item = ProjectListItem.fromJson(_minimal());
      expect(item.isActive, isTrue);
    });

    test('defaults viewCount to 0', () {
      final item = ProjectListItem.fromJson(_minimal());
      expect(item.viewCount, 0);
    });

    test('excerpt is null when not provided', () {
      final item = ProjectListItem.fromJson(_minimal());
      expect(item.excerpt, isNull);
    });

    test('thumbnailUrl is null when not provided', () {
      final item = ProjectListItem.fromJson(_minimal());
      expect(item.thumbnailUrl, isNull);
    });

    test('parses nested category correctly', () {
      final item = ProjectListItem.fromJson(_minimal());
      expect(item.category.id, 'c1');
      expect(item.category.name, 'Art');
      expect(item.category.slug, 'art');
    });

    test('parses isFeatured = true when provided', () {
      final data = _minimal()..['isFeatured'] = true;
      final item = ProjectListItem.fromJson(data);
      expect(item.isFeatured, isTrue);
    });

    test('parses viewCount when provided', () {
      final data = _minimal()..['viewCount'] = 42;
      final item = ProjectListItem.fromJson(data);
      expect(item.viewCount, 42);
    });

    test('toJson produces a map', () {
      final item = ProjectListItem.fromJson(_minimal());
      final json = item.toJson();
      expect(json, isA<Map<String, dynamic>>());
      expect(json['id'], 'p1');
      expect(json['title'], 'My Project');
    });
  });

  // ── ProjectDetail fromJson ────────────────────────────────────────────────

  group('ProjectDetail.fromJson', () {
    Map<String, dynamic> _full() => {
      'id': 'pd1',
      'title': 'Full Project',
      'slug': 'full-project',
      'description': 'A description',
      'date': '2024-06-15',
      'categoryId': 'c2',
      'createdAt': '2024-06-15T00:00:00Z',
      'updatedAt': '2024-06-15T00:00:00Z',
      'category': {'id': 'c2', 'name': 'Design', 'slug': 'design'},
    };

    test('parses required fields', () {
      final detail = ProjectDetail.fromJson(_full());
      expect(detail.id, 'pd1');
      expect(detail.title, 'Full Project');
      expect(detail.slug, 'full-project');
      expect(detail.description, 'A description');
    });

    test('defaults tags to empty list', () {
      final detail = ProjectDetail.fromJson(_full());
      expect(detail.tags, isEmpty);
    });

    test('defaults metaKeywords to empty list', () {
      final detail = ProjectDetail.fromJson(_full());
      expect(detail.metaKeywords, isEmpty);
    });

    test('defaults images to empty list', () {
      final detail = ProjectDetail.fromJson(_full());
      expect(detail.images, isEmpty);
    });

    test('defaults isFeatured to false', () {
      final detail = ProjectDetail.fromJson(_full());
      expect(detail.isFeatured, isFalse);
    });

    test('defaults isActive to true', () {
      final detail = ProjectDetail.fromJson(_full());
      expect(detail.isActive, isTrue);
    });

    test('defaults likeCount to 0', () {
      final detail = ProjectDetail.fromJson(_full());
      expect(detail.likeCount, 0);
    });

    test('parses tags when provided', () {
      final data = _full()..['tags'] = ['flutter', 'dart'];
      final detail = ProjectDetail.fromJson(data);
      expect(detail.tags, ['flutter', 'dart']);
    });

    test('parses images list with nested objects', () {
      final data = _full()
        ..['images'] = [
          {'id': 'img1', 'url': 'https://x.com/1.jpg', 'order': 0},
          {'id': 'img2', 'url': 'https://x.com/2.jpg', 'order': 1},
        ];
      final detail = ProjectDetail.fromJson(data);
      expect(detail.images.length, 2);
      expect(detail.images[0].id, 'img1');
      expect(detail.images[1].sortOrder, 1);
    });

    test('parses optional fields', () {
      final data = _full()
        ..['excerpt'] = 'Excerpt text'
        ..['client'] = 'Client A'
        ..['location'] = 'Madrid'
        ..['duration'] = '3 months'
        ..['videoUrl'] = 'https://youtube.com/watch?v=x';
      final detail = ProjectDetail.fromJson(data);
      expect(detail.excerpt, 'Excerpt text');
      expect(detail.client, 'Client A');
      expect(detail.location, 'Madrid');
      expect(detail.duration, '3 months');
      expect(detail.videoUrl, 'https://youtube.com/watch?v=x');
    });

    test('parses nested category', () {
      final detail = ProjectDetail.fromJson(_full());
      expect(detail.category.id, 'c2');
      expect(detail.category.name, 'Design');
    });

    test('toJson produces a map with id and title', () {
      final detail = ProjectDetail.fromJson(_full());
      final json = detail.toJson();
      expect(json, isA<Map<String, dynamic>>());
      expect(json['id'], 'pd1');
      expect(json['title'], 'Full Project');
    });
  });
}
