// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'google_calendar_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(googleCalendarService)
final googleCalendarServiceProvider = GoogleCalendarServiceProvider._();

final class GoogleCalendarServiceProvider
    extends $FunctionalProvider<GoogleCalendarService, GoogleCalendarService, GoogleCalendarService>
    with $Provider<GoogleCalendarService> {
  GoogleCalendarServiceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'googleCalendarServiceProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$googleCalendarServiceHash();

  @$internal
  @override
  $ProviderElement<GoogleCalendarService> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  GoogleCalendarService create(Ref ref) {
    return googleCalendarService(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(GoogleCalendarService value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<GoogleCalendarService>(value));
  }
}

String _$googleCalendarServiceHash() => r'd4cea88ff33c6204cea3f01aaa55f6e70e0c44b9';

/// Gestiona el estado de autenticación de Google Calendar y la creación
/// de eventos en el calendario del usuario.
///
/// Estados posibles:
/// - [GoogleAuthDisconnected]: sin cuenta conectada.
/// - [GoogleAuthConnecting]: flujo OAuth en curso.
/// - [GoogleAuthConnected(email)]: cuenta conectada y operativa.
/// - [GoogleAuthError(message)]: error en el proceso.

@ProviderFor(GoogleCalendarNotifier)
final googleCalendarProvider = GoogleCalendarNotifierProvider._();

/// Gestiona el estado de autenticación de Google Calendar y la creación
/// de eventos en el calendario del usuario.
///
/// Estados posibles:
/// - [GoogleAuthDisconnected]: sin cuenta conectada.
/// - [GoogleAuthConnecting]: flujo OAuth en curso.
/// - [GoogleAuthConnected(email)]: cuenta conectada y operativa.
/// - [GoogleAuthError(message)]: error en el proceso.
final class GoogleCalendarNotifierProvider extends $AsyncNotifierProvider<GoogleCalendarNotifier, GoogleAuthState> {
  /// Gestiona el estado de autenticación de Google Calendar y la creación
  /// de eventos en el calendario del usuario.
  ///
  /// Estados posibles:
  /// - [GoogleAuthDisconnected]: sin cuenta conectada.
  /// - [GoogleAuthConnecting]: flujo OAuth en curso.
  /// - [GoogleAuthConnected(email)]: cuenta conectada y operativa.
  /// - [GoogleAuthError(message)]: error en el proceso.
  GoogleCalendarNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'googleCalendarProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$googleCalendarNotifierHash();

  @$internal
  @override
  GoogleCalendarNotifier create() => GoogleCalendarNotifier();
}

String _$googleCalendarNotifierHash() => r'89e0a67d051b74f6a3b29209f57e1647e86f6561';

/// Gestiona el estado de autenticación de Google Calendar y la creación
/// de eventos en el calendario del usuario.
///
/// Estados posibles:
/// - [GoogleAuthDisconnected]: sin cuenta conectada.
/// - [GoogleAuthConnecting]: flujo OAuth en curso.
/// - [GoogleAuthConnected(email)]: cuenta conectada y operativa.
/// - [GoogleAuthError(message)]: error en el proceso.

abstract class _$GoogleCalendarNotifier extends $AsyncNotifier<GoogleAuthState> {
  FutureOr<GoogleAuthState> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AsyncValue<GoogleAuthState>, GoogleAuthState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<GoogleAuthState>, GoogleAuthState>,
              AsyncValue<GoogleAuthState>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
