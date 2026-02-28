// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trash_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(trashRepository)
final trashRepositoryProvider = TrashRepositoryProvider._();

final class TrashRepositoryProvider extends $FunctionalProvider<TrashRepository, TrashRepository, TrashRepository>
    with $Provider<TrashRepository> {
  TrashRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'trashRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$trashRepositoryHash();

  @$internal
  @override
  $ProviderElement<TrashRepository> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  TrashRepository create(Ref ref) {
    return trashRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(TrashRepository value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<TrashRepository>(value));
  }
}

String _$trashRepositoryHash() => r'5bfe44f213f7b8caee90d762f69ac79c44f8b69d';

@ProviderFor(trashItems)
final trashItemsProvider = TrashItemsProvider._();

final class TrashItemsProvider
    extends
        $FunctionalProvider<
          AsyncValue<Map<String, List<TrashItem>>>,
          Map<String, List<TrashItem>>,
          FutureOr<Map<String, List<TrashItem>>>
        >
    with $FutureModifier<Map<String, List<TrashItem>>>, $FutureProvider<Map<String, List<TrashItem>>> {
  TrashItemsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'trashItemsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$trashItemsHash();

  @$internal
  @override
  $FutureProviderElement<Map<String, List<TrashItem>>> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<Map<String, List<TrashItem>>> create(Ref ref) {
    return trashItems(ref);
  }
}

String _$trashItemsHash() => r'd54a128858e219aee4b3486ac2eff78b72f2f12f';
