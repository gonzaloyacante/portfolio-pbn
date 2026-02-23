// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trash_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$trashRepositoryHash() => r'5bfe44f213f7b8caee90d762f69ac79c44f8b69d';

/// See also [trashRepository].
@ProviderFor(trashRepository)
final trashRepositoryProvider = AutoDisposeProvider<TrashRepository>.internal(
  trashRepository,
  name: r'trashRepositoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$trashRepositoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef TrashRepositoryRef = AutoDisposeProviderRef<TrashRepository>;
String _$trashItemsHash() => r'd54a128858e219aee4b3486ac2eff78b72f2f12f';

/// See also [trashItems].
@ProviderFor(trashItems)
final trashItemsProvider =
    AutoDisposeFutureProvider<Map<String, List<TrashItem>>>.internal(
      trashItems,
      name: r'trashItemsProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$trashItemsHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef TrashItemsRef =
    AutoDisposeFutureProviderRef<Map<String, List<TrashItem>>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
