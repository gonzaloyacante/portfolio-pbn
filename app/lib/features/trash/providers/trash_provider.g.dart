// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trash_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(trashItems)
final trashItemsProvider = TrashItemsProvider._();

final class TrashItemsProvider
    extends
        $FunctionalProvider<
          AsyncValue<Map<String, List<TrashItem>>>,
          Map<String, List<TrashItem>>,
          FutureOr<Map<String, List<TrashItem>>>
        >
    with
        $FutureModifier<Map<String, List<TrashItem>>>,
        $FutureProvider<Map<String, List<TrashItem>>> {
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
  $FutureProviderElement<Map<String, List<TrashItem>>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<Map<String, List<TrashItem>>> create(Ref ref) {
    return trashItems(ref);
  }
}

String _$trashItemsHash() => r'71732119b561c56236941e793e7353f5ee02ec62';
