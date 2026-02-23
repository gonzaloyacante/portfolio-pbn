// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'google_calendar_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$googleCalendarServiceHash() =>
    r'd4cea88ff33c6204cea3f01aaa55f6e70e0c44b9';

/// See also [googleCalendarService].
@ProviderFor(googleCalendarService)
final googleCalendarServiceProvider =
    AutoDisposeProvider<GoogleCalendarService>.internal(
      googleCalendarService,
      name: r'googleCalendarServiceProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$googleCalendarServiceHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef GoogleCalendarServiceRef =
    AutoDisposeProviderRef<GoogleCalendarService>;
String _$googleCalendarNotifierHash() =>
    r'51a96bd078aa7cf057b377a2698675cfeb2d1b96';

/// Gestiona el estado de autenticación de Google Calendar y la creación
/// de eventos en el calendario del usuario.
///
/// Estados posibles:
/// - [GoogleAuthDisconnected]: sin cuenta conectada.
/// - [GoogleAuthConnecting]: flujo OAuth en curso.
/// - [GoogleAuthConnected(email)]: cuenta conectada y operativa.
/// - [GoogleAuthError(message)]: error en el proceso.
///
/// Copied from [GoogleCalendarNotifier].
@ProviderFor(GoogleCalendarNotifier)
final googleCalendarNotifierProvider =
    AutoDisposeAsyncNotifierProvider<
      GoogleCalendarNotifier,
      GoogleAuthState
    >.internal(
      GoogleCalendarNotifier.new,
      name: r'googleCalendarNotifierProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$googleCalendarNotifierHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$GoogleCalendarNotifier = AutoDisposeAsyncNotifier<GoogleAuthState>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
