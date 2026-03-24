import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/api_exceptions.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/core/auth/auth_repository.dart';
import 'package:portfolio_pbn/core/auth/auth_state.dart';
import 'package:portfolio_pbn/core/auth/token_storage.dart';

// ── Mocks ─────────────────────────────────────────────────────────────────────

class MockApiClient extends Mock implements ApiClient {}

class MockTokenStorage extends Mock implements TokenStorage {}

// ── Helpers ───────────────────────────────────────────────────────────────────

final _validLoginResponse = <String, dynamic>{
  'data': {
    'accessToken': 'access-token-123',
    'refreshToken': 'refresh-token-456',
    'user': {
      'id': 'user-1',
      'email': 'admin@test.com',
      'name': 'Admin',
      'role': 'admin',
    },
  },
};

final _meResponse = <String, dynamic>{
  'data': {
    'user': {
      'id': 'user-1',
      'email': 'admin@test.com',
      'name': 'Admin',
      'role': 'admin',
    },
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

void main() {
  late MockApiClient api;
  late MockTokenStorage storage;
  late AuthRepository authRepo;

  setUp(() {
    api = MockApiClient();
    storage = MockTokenStorage();
    authRepo = AuthRepository(apiClient: api, tokenStorage: storage);
  });

  // ── login ───────────────────────────────────────────────────────────────

  group('login', () {
    test('stores tokens and returns UserProfile on success', () async {
      when(
        () => api.post<Map<String, dynamic>>(
          Endpoints.authLogin,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async => _validLoginResponse);
      when(
        () => storage.saveAccessToken(any<String>()),
      ).thenAnswer((_) async {});
      when(
        () => storage.saveRefreshToken(any<String>()),
      ).thenAnswer((_) async {});

      final profile = await authRepo.login(
        email: 'admin@test.com',
        password: 'secret123',
      );

      expect(profile, isA<UserProfile>());
      expect(profile.email, 'admin@test.com');
      expect(profile.name, 'Admin');

      verify(() => storage.saveAccessToken('access-token-123')).called(1);
      verify(() => storage.saveRefreshToken('refresh-token-456')).called(1);
    });

    test('throws ServerException on missing tokens', () async {
      when(
        () => api.post<Map<String, dynamic>>(
          Endpoints.authLogin,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async => {'data': <String, dynamic>{}});

      expect(
        () => authRepo.login(email: 'a@b.com', password: 'x'),
        throwsA(isA<ServerException>()),
      );
    });

    test('propagates UnauthorizedException from API', () async {
      when(
        () => api.post<Map<String, dynamic>>(
          Endpoints.authLogin,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenThrow(const UnauthorizedException());

      expect(
        () => authRepo.login(email: 'a@b.com', password: 'wrong'),
        throwsA(isA<UnauthorizedException>()),
      );
    });

    test('propagates RateLimitException from API', () async {
      when(
        () => api.post<Map<String, dynamic>>(
          Endpoints.authLogin,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenThrow(const RateLimitException());

      expect(
        () => authRepo.login(email: 'a@b.com', password: '1'),
        throwsA(isA<RateLimitException>()),
      );
    });
  });

  // ── logout ──────────────────────────────────────────────────────────────

  group('logout', () {
    test('calls server then clears local storage', () async {
      when(
        () => storage.getRefreshToken(),
      ).thenAnswer((_) async => 'refresh-123');
      when(
        () => api.post<void>(
          Endpoints.authLogout,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenAnswer((_) async {});
      when(() => storage.clearAll()).thenAnswer((_) async {});

      await authRepo.logout();

      verify(() => storage.clearAll()).called(1);
    });

    test('clears storage even if server call fails', () async {
      when(
        () => storage.getRefreshToken(),
      ).thenAnswer((_) async => 'refresh-123');
      when(
        () => api.post<void>(
          Endpoints.authLogout,
          data: any<Map<String, dynamic>>(named: 'data'),
        ),
      ).thenThrow(const NetworkException());
      when(() => storage.clearAll()).thenAnswer((_) async {});

      await authRepo.logout();

      verify(() => storage.clearAll()).called(1);
    });
  });

  // ── getMe ───────────────────────────────────────────────────────────────

  group('getMe', () {
    test('parses nested user response', () async {
      when(
        () => api.get<Map<String, dynamic>>(Endpoints.authMe),
      ).thenAnswer((_) async => _meResponse);

      final profile = await authRepo.getMe();

      expect(profile.id, 'user-1');
      expect(profile.email, 'admin@test.com');
    });

    test('throws ServerException on empty response', () async {
      when(
        () => api.get<Map<String, dynamic>>(Endpoints.authMe),
      ).thenAnswer((_) async => {'data': <String, dynamic>{}});

      expect(() => authRepo.getMe(), throwsA(isA<ServerException>()));
    });
  });

  // ── hasSession ──────────────────────────────────────────────────────────

  group('hasSession', () {
    test('delegates to TokenStorage', () async {
      when(() => storage.hasSession()).thenAnswer((_) async => true);

      final result = await authRepo.hasSession();

      expect(result, isTrue);
      verify(() => storage.hasSession()).called(1);
    });
  });
}
