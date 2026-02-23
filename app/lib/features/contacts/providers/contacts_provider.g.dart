// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contacts_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$contactsRepositoryHash() =>
    r'e8a89bf5730b722b5ade5c86622df5a3852c14df';

/// See also [contactsRepository].
@ProviderFor(contactsRepository)
final contactsRepositoryProvider =
    AutoDisposeProvider<ContactsRepository>.internal(
      contactsRepository,
      name: r'contactsRepositoryProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$contactsRepositoryHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ContactsRepositoryRef = AutoDisposeProviderRef<ContactsRepository>;
String _$contactsListHash() => r'2bbc308f0eacca1bd87f526f2129d1c4468f3399';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

/// See also [contactsList].
@ProviderFor(contactsList)
const contactsListProvider = ContactsListFamily();

/// See also [contactsList].
class ContactsListFamily
    extends Family<AsyncValue<PaginatedResponse<ContactItem>>> {
  /// See also [contactsList].
  const ContactsListFamily();

  /// See also [contactsList].
  ContactsListProvider call({
    int page = 1,
    String? search,
    String? status,
    String? priority,
    bool? unreadOnly,
  }) {
    return ContactsListProvider(
      page: page,
      search: search,
      status: status,
      priority: priority,
      unreadOnly: unreadOnly,
    );
  }

  @override
  ContactsListProvider getProviderOverride(
    covariant ContactsListProvider provider,
  ) {
    return call(
      page: provider.page,
      search: provider.search,
      status: provider.status,
      priority: provider.priority,
      unreadOnly: provider.unreadOnly,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'contactsListProvider';
}

/// See also [contactsList].
class ContactsListProvider
    extends AutoDisposeFutureProvider<PaginatedResponse<ContactItem>> {
  /// See also [contactsList].
  ContactsListProvider({
    int page = 1,
    String? search,
    String? status,
    String? priority,
    bool? unreadOnly,
  }) : this._internal(
         (ref) => contactsList(
           ref as ContactsListRef,
           page: page,
           search: search,
           status: status,
           priority: priority,
           unreadOnly: unreadOnly,
         ),
         from: contactsListProvider,
         name: r'contactsListProvider',
         debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
             ? null
             : _$contactsListHash,
         dependencies: ContactsListFamily._dependencies,
         allTransitiveDependencies:
             ContactsListFamily._allTransitiveDependencies,
         page: page,
         search: search,
         status: status,
         priority: priority,
         unreadOnly: unreadOnly,
       );

  ContactsListProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.page,
    required this.search,
    required this.status,
    required this.priority,
    required this.unreadOnly,
  }) : super.internal();

  final int page;
  final String? search;
  final String? status;
  final String? priority;
  final bool? unreadOnly;

  @override
  Override overrideWith(
    FutureOr<PaginatedResponse<ContactItem>> Function(ContactsListRef provider)
    create,
  ) {
    return ProviderOverride(
      origin: this,
      override: ContactsListProvider._internal(
        (ref) => create(ref as ContactsListRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        page: page,
        search: search,
        status: status,
        priority: priority,
        unreadOnly: unreadOnly,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<PaginatedResponse<ContactItem>>
  createElement() {
    return _ContactsListProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ContactsListProvider &&
        other.page == page &&
        other.search == search &&
        other.status == status &&
        other.priority == priority &&
        other.unreadOnly == unreadOnly;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, page.hashCode);
    hash = _SystemHash.combine(hash, search.hashCode);
    hash = _SystemHash.combine(hash, status.hashCode);
    hash = _SystemHash.combine(hash, priority.hashCode);
    hash = _SystemHash.combine(hash, unreadOnly.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ContactsListRef
    on AutoDisposeFutureProviderRef<PaginatedResponse<ContactItem>> {
  /// The parameter `page` of this provider.
  int get page;

  /// The parameter `search` of this provider.
  String? get search;

  /// The parameter `status` of this provider.
  String? get status;

  /// The parameter `priority` of this provider.
  String? get priority;

  /// The parameter `unreadOnly` of this provider.
  bool? get unreadOnly;
}

class _ContactsListProviderElement
    extends AutoDisposeFutureProviderElement<PaginatedResponse<ContactItem>>
    with ContactsListRef {
  _ContactsListProviderElement(super.provider);

  @override
  int get page => (origin as ContactsListProvider).page;
  @override
  String? get search => (origin as ContactsListProvider).search;
  @override
  String? get status => (origin as ContactsListProvider).status;
  @override
  String? get priority => (origin as ContactsListProvider).priority;
  @override
  bool? get unreadOnly => (origin as ContactsListProvider).unreadOnly;
}

String _$contactDetailHash() => r'e7a5f32d03ead5460d9ef02f9ba4317d24516a82';

/// See also [contactDetail].
@ProviderFor(contactDetail)
const contactDetailProvider = ContactDetailFamily();

/// See also [contactDetail].
class ContactDetailFamily extends Family<AsyncValue<ContactDetail>> {
  /// See also [contactDetail].
  const ContactDetailFamily();

  /// See also [contactDetail].
  ContactDetailProvider call(String id) {
    return ContactDetailProvider(id);
  }

  @override
  ContactDetailProvider getProviderOverride(
    covariant ContactDetailProvider provider,
  ) {
    return call(provider.id);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'contactDetailProvider';
}

/// See also [contactDetail].
class ContactDetailProvider extends AutoDisposeFutureProvider<ContactDetail> {
  /// See also [contactDetail].
  ContactDetailProvider(String id)
    : this._internal(
        (ref) => contactDetail(ref as ContactDetailRef, id),
        from: contactDetailProvider,
        name: r'contactDetailProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$contactDetailHash,
        dependencies: ContactDetailFamily._dependencies,
        allTransitiveDependencies:
            ContactDetailFamily._allTransitiveDependencies,
        id: id,
      );

  ContactDetailProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.id,
  }) : super.internal();

  final String id;

  @override
  Override overrideWith(
    FutureOr<ContactDetail> Function(ContactDetailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: ContactDetailProvider._internal(
        (ref) => create(ref as ContactDetailRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        id: id,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<ContactDetail> createElement() {
    return _ContactDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ContactDetailProvider && other.id == id;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, id.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ContactDetailRef on AutoDisposeFutureProviderRef<ContactDetail> {
  /// The parameter `id` of this provider.
  String get id;
}

class _ContactDetailProviderElement
    extends AutoDisposeFutureProviderElement<ContactDetail>
    with ContactDetailRef {
  _ContactDetailProviderElement(super.provider);

  @override
  String get id => (origin as ContactDetailProvider).id;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
