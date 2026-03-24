import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/api_exceptions.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/features/projects/data/project_model.dart';
import 'package:portfolio_pbn/features/projects/data/projects_repository.dart';

// ── Mocks ─────────────────────────────────────────────────────────────────────

class MockApiClient extends Mock implements ApiClient {}

// ── Helpers ───────────────────────────────────────────────────────────────────

const _category = {'id': 'cat-1', 'name': 'Retrato', 'slug': 'retrato'};

Map<String, dynamic> _projectListJson({String id = 'p-1'}) => {
  'id': id,
  'title': 'Test Project',
  'slug': 'test-project',
  'excerpt': null,
  'thumbnailUrl': null,
  'date': '2024-01-01',
  'sortOrder': 0,
  'isFeatured': false,
  'isPinned': false,
  'isActive': true,
  'viewCount': 0,
  'createdAt': '2024-01-01T00:00:00Z',
  'updatedAt': '2024-01-01T00:00:00Z',
  'category': _category,
};

Map<String, dynamic> _projectDetailJson({String id = 'p-1'}) => {
  ..._projectListJson(id: id),
  'description': 'A detailed description',
  'videoUrl': null,
  'duration': null,
  'client': null,
  'location': null,
  'tags': <String>[],
  'metaTitle': null,
  'metaDescription': null,
  'metaKeywords': <String>[],
  'ogImage': null,
  'categoryId': 'cat-1',
  'likeCount': 0,
  'publishedAt': null,
  'images': <dynamic>[],
};

Map<String, dynamic> _paginatedResponse({List<Map<String, dynamic>>? items}) =>
    {
      'success': true,
      'data': {
        'data': items ?? [_projectListJson()],
        'pagination': {
          'page': 1,
          'limit': 20,
          'total': 1,
          'totalPages': 1,
          'hasNext': false,
          'hasPrev': false,
        },
      },
    };

Map<String, dynamic> _successResponse(Map<String, dynamic> data) => {
  'success': true,
  'data': data,
};

Map<String, dynamic> _voidSuccessResponse() => {'success': true};

Map<String, dynamic> _errorResponse(String error) => {
  'success': false,
  'error': error,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

void main() {
  late MockApiClient client;
  late ProjectsRepository repo;

  setUp(() {
    client = MockApiClient();
    repo = ProjectsRepository(client);
  });

  // ── getProjects ─────────────────────────────────────────────────────────

  group('getProjects', () {
    test('returns paginated list on success', () async {
      when(
        () => client.get<Map<String, dynamic>>(
          Endpoints.projects,
          queryParams: any<Map<String, dynamic>>(named: 'queryParams'),
        ),
      ).thenAnswer((_) async => _paginatedResponse());

      final result = await repo.getProjects();

      expect(result.data, hasLength(1));
      expect(result.data.first.title, 'Test Project');
      expect(result.pagination.total, 1);
    });

    test('passes all query params correctly', () async {
      when(
        () => client.get<Map<String, dynamic>>(
          Endpoints.projects,
          queryParams: {
            'page': 2,
            'limit': 10,
            'search': 'test',
            'categoryId': 'cat-1',
            'active': 'true',
            'featured': 'false',
          },
        ),
      ).thenAnswer((_) async => _paginatedResponse());

      await repo.getProjects(
        page: 2,
        limit: 10,
        search: 'test',
        categoryId: 'cat-1',
        isActive: true,
        isFeatured: false,
      );

      verify(
        () => client.get<Map<String, dynamic>>(
          Endpoints.projects,
          queryParams: {
            'page': 2,
            'limit': 10,
            'search': 'test',
            'categoryId': 'cat-1',
            'active': 'true',
            'featured': 'false',
          },
        ),
      ).called(1);
    });

    test('throws when API returns error', () async {
      when(
        () => client.get<Map<String, dynamic>>(
          Endpoints.projects,
          queryParams: any<Map<String, dynamic>>(named: 'queryParams'),
        ),
      ).thenAnswer((_) async => _errorResponse('Server error'));

      expect(() => repo.getProjects(), throwsA(isA<Exception>()));
    });

    test('propagates NotFoundException from client', () async {
      when(
        () => client.get<Map<String, dynamic>>(
          Endpoints.projects,
          queryParams: any<Map<String, dynamic>>(named: 'queryParams'),
        ),
      ).thenThrow(const NotFoundException());

      expect(() => repo.getProjects(), throwsA(isA<NotFoundException>()));
    });
  });

  // ── getProject ──────────────────────────────────────────────────────────

  group('getProject', () {
    test('returns project detail on success', () async {
      when(
        () => client.get<Map<String, dynamic>>(Endpoints.project('p-1')),
      ).thenAnswer((_) async => _successResponse(_projectDetailJson()));

      final result = await repo.getProject('p-1');

      expect(result.id, 'p-1');
      expect(result.title, 'Test Project');
      expect(result.description, 'A detailed description');
    });

    test('throws on error response', () async {
      when(
        () => client.get<Map<String, dynamic>>(Endpoints.project('bad')),
      ).thenAnswer((_) async => _errorResponse('Not found'));

      expect(() => repo.getProject('bad'), throwsA(isA<Exception>()));
    });
  });

  // ── createProject ───────────────────────────────────────────────────────

  group('createProject', () {
    test('sends form data and returns created project', () async {
      final formData = ProjectFormData(
        title: 'New Project',
        description: 'Description',
        categoryId: 'cat-1',
      );

      when(
        () => client.post<Map<String, dynamic>>(
          Endpoints.projects,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer(
        (_) async => _successResponse(_projectListJson(id: 'p-new')),
      );

      final result = await repo.createProject(formData);

      expect(result.id, 'p-new');
      verify(
        () => client.post<Map<String, dynamic>>(
          Endpoints.projects,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).called(1);
    });
  });

  // ── updateProject ──────────────────────────────────────────────────────

  group('updateProject', () {
    test('sends changes and returns updated detail', () async {
      when(
        () => client.patch<Map<String, dynamic>>(
          Endpoints.project('p-1'),
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async => _successResponse(_projectDetailJson()));

      final result = await repo.updateProject('p-1', {'title': 'Updated'});

      expect(result.id, 'p-1');
      verify(
        () => client.patch<Map<String, dynamic>>(
          Endpoints.project('p-1'),
          data: {'title': 'Updated'},
        ),
      ).called(1);
    });
  });

  // ── deleteProject ──────────────────────────────────────────────────────

  group('deleteProject', () {
    test('calls delete endpoint', () async {
      when(
        () => client.delete<Map<String, dynamic>>(Endpoints.project('p-1')),
      ).thenAnswer((_) async => _voidSuccessResponse());

      await repo.deleteProject('p-1');

      verify(
        () => client.delete<Map<String, dynamic>>(Endpoints.project('p-1')),
      ).called(1);
    });

    test('throws on error response', () async {
      when(
        () => client.delete<Map<String, dynamic>>(Endpoints.project('x')),
      ).thenAnswer((_) async => _errorResponse('Cannot delete'));

      expect(() => repo.deleteProject('x'), throwsA(isA<Exception>()));
    });
  });

  // ── reorderProjects ────────────────────────────────────────────────────

  group('reorderProjects', () {
    test('sends items with correct structure', () async {
      when(
        () => client.post<Map<String, dynamic>>(
          Endpoints.projectsReorder,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async => _voidSuccessResponse());

      await repo.reorderProjects([
        (id: 'p-1', sortOrder: 0),
        (id: 'p-2', sortOrder: 1),
      ]);

      verify(
        () => client.post<Map<String, dynamic>>(
          Endpoints.projectsReorder,
          data: {
            'items': [
              {'id': 'p-1', 'sortOrder': 0},
              {'id': 'p-2', 'sortOrder': 1},
            ],
          },
        ),
      ).called(1);
    });
  });

  // ── Image operations ───────────────────────────────────────────────────

  group('addProjectImage', () {
    test('sends image data to correct endpoint', () async {
      when(
        () => client.post<Map<String, dynamic>>(
          Endpoints.projectImages('p-1'),
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async => _voidSuccessResponse());

      await repo.addProjectImage(
        'p-1',
        url: 'https://cdn.example.com/img.jpg',
        publicId: 'folder/img',
        order: 2,
        alt: 'Alt text',
      );

      verify(
        () => client.post<Map<String, dynamic>>(
          Endpoints.projectImages('p-1'),
          data: {
            'url': 'https://cdn.example.com/img.jpg',
            'publicId': 'folder/img',
            'order': 2,
            'alt': 'Alt text',
          },
        ),
      ).called(1);
    });
  });

  group('removeProjectImage', () {
    test('calls delete on the correct image endpoint', () async {
      when(
        () => client.delete<Map<String, dynamic>>(
          Endpoints.projectImage('p-1', 'img-1'),
        ),
      ).thenAnswer((_) async => _voidSuccessResponse());

      await repo.removeProjectImage('p-1', 'img-1');

      verify(
        () => client.delete<Map<String, dynamic>>(
          Endpoints.projectImage('p-1', 'img-1'),
        ),
      ).called(1);
    });
  });

  group('reorderImages', () {
    test('sends reorder payload via PUT', () async {
      when(
        () => client.put<Map<String, dynamic>>(
          Endpoints.projectImagesReorder('p-1'),
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async => _voidSuccessResponse());

      await repo.reorderImages('p-1', [
        {'id': 'img-1', 'order': 0},
        {'id': 'img-2', 'order': 1},
      ]);

      verify(
        () => client.put<Map<String, dynamic>>(
          Endpoints.projectImagesReorder('p-1'),
          data: {
            'items': [
              {'id': 'img-1', 'order': 0},
              {'id': 'img-2', 'order': 1},
            ],
          },
        ),
      ).called(1);
    });
  });
}
