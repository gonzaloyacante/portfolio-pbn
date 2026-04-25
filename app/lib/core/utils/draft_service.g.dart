// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'draft_service.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(draftService)
final draftServiceProvider = DraftServiceProvider._();

final class DraftServiceProvider
    extends $FunctionalProvider<DraftService, DraftService, DraftService>
    with $Provider<DraftService> {
  DraftServiceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'draftServiceProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$draftServiceHash();

  @$internal
  @override
  $ProviderElement<DraftService> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  DraftService create(Ref ref) {
    return draftService(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(DraftService value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<DraftService>(value),
    );
  }
}

String _$draftServiceHash() => r'1031bcad085ab224e0039ca45a8069476f37cd1d';
