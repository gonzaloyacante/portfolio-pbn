// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trash_repository.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(trashRepository)
final trashRepositoryProvider = TrashRepositoryProvider._();

final class TrashRepositoryProvider
    extends
        $FunctionalProvider<TrashRepository, TrashRepository, TrashRepository>
    with $Provider<TrashRepository> {
  TrashRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'trashRepositoryProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$trashRepositoryHash();

  @$internal
  @override
  $ProviderElement<TrashRepository> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  TrashRepository create(Ref ref) {
    return trashRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(TrashRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<TrashRepository>(value),
    );
  }
}

String _$trashRepositoryHash() => r'5442ac005f333b7ff3f22d18c89307126a4b6564';
