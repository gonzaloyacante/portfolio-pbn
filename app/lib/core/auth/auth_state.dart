// ignore_for_file: invalid_annotation_target
import 'package:freezed_annotation/freezed_annotation.dart';

part 'auth_state.freezed.dart';
part 'auth_state.g.dart';

// ── UserProfile ───────────────────────────────────────────────────────────────

/// Perfil del usuario administrador autenticado.
@freezed
abstract class UserProfile with _$UserProfile {
  const factory UserProfile({
    required String id,
    required String email,
    required String name,
    @Default('admin') String role,
    @JsonKey(name: 'avatarUrl') String? image,
    String? bio,
    String? locale,
    String? timezone,
    DateTime? lastLoginAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _UserProfile;

  factory UserProfile.fromJson(Map<String, dynamic> json) =>
      _$UserProfileFromJson(json);
}

// ── AuthState ─────────────────────────────────────────────────────────────────

/// Estado de autenticación de la app.
///
/// ```
/// Unauthenticated  →  Authenticating  →  Authenticated
///       ↑______________Unauthenticated (on logout/session expired)
/// ```
@freezed
sealed class AuthState with _$AuthState {
  /// No hay sesión activa. Se muestra la pantalla de login.
  const factory AuthState.unauthenticated() = Unauthenticated;

  /// Login en curso (esperando respuesta del servidor).
  const factory AuthState.authenticating() = Authenticating;

  /// Sesión activa con el perfil del usuario cargado.
  const factory AuthState.authenticated({required UserProfile user}) =
      Authenticated;

  /// Error de autenticación (credenciales incorrectas, red, etc.).
  const factory AuthState.error({required String message}) = AuthError;
}
