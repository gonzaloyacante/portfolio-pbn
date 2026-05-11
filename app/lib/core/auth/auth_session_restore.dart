import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../api/api_exceptions.dart';
import '../utils/app_logger.dart';
import 'auth_repository.dart';
import 'auth_state.dart';
import 'token_storage.dart';

/// Restaura sesión al arranque: tokens → GET /me, o fallback offline con usuario cacheado.
Future<AuthState> restoreAuthSession(Ref ref) async {
  try {
    final repo = ref.read(authRepositoryProvider);
    final hasSession = await repo.hasSession();

    if (!hasSession) {
      AppLogger.info('AuthNotifier: no stored session → unauthenticated');
      return const AuthState.unauthenticated();
    }

    AppLogger.info('AuthNotifier: stored session found → validating with /me');
    final user = await repo.getMe();
    AppLogger.info('AuthNotifier: session restored for ${user.email}');
    await ref.read(tokenStorageProvider).saveUser(user);
    Sentry.configureScope(
      (scope) => scope.setUser(
        SentryUser(id: user.id, email: user.email, name: user.name),
      ),
    );
    return AuthState.authenticated(user: user);
  } on UnauthorizedException catch (_) {
    AppLogger.warn('AuthNotifier: stored session expired → unauthenticated');
    return const AuthState.unauthenticated();
  } catch (e, st) {
    if (e is NetworkException) {
      AppLogger.warn(
        'AuthNotifier: session restore failed — sin conectividad. Intentando usuario cacheado.',
      );
      final cachedUser = await ref.read(tokenStorageProvider).getUser();
      if (cachedUser != null) {
        AppLogger.info(
          'AuthNotifier: sesión offline restaurada para ${cachedUser.email}',
        );
        return AuthState.authenticated(user: cachedUser);
      }
    } else {
      AppLogger.error('AuthNotifier: session restore failed', e, st);
    }
    return const AuthState.unauthenticated();
  }
}
