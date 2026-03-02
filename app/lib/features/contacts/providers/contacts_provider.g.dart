// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contacts_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(contactsRepository)
final contactsRepositoryProvider = ContactsRepositoryProvider._();

final class ContactsRepositoryProvider
    extends
        $FunctionalProvider<
          ContactsRepository,
          ContactsRepository,
          ContactsRepository
        >
    with $Provider<ContactsRepository> {
  ContactsRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'contactsRepositoryProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$contactsRepositoryHash();

  @$internal
  @override
  $ProviderElement<ContactsRepository> $createElement(
    $ProviderPointer pointer,
  ) => $ProviderElement(pointer);

  @override
  ContactsRepository create(Ref ref) {
    return contactsRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ContactsRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ContactsRepository>(value),
    );
  }
}

String _$contactsRepositoryHash() =>
    r'0adb2da73c201bea42a64f46769138d210ea3d15';

@ProviderFor(contactsList)
final contactsListProvider = ContactsListFamily._();

final class ContactsListProvider
    extends
        $FunctionalProvider<
          AsyncValue<PaginatedResponse<ContactItem>>,
          PaginatedResponse<ContactItem>,
          FutureOr<PaginatedResponse<ContactItem>>
        >
    with
        $FutureModifier<PaginatedResponse<ContactItem>>,
        $FutureProvider<PaginatedResponse<ContactItem>> {
  ContactsListProvider._({
    required ContactsListFamily super.from,
    required ({
      int page,
      String? search,
      String? status,
      String? priority,
      bool? unreadOnly,
    })
    super.argument,
  }) : super(
         retry: null,
         name: r'contactsListProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$contactsListHash();

  @override
  String toString() {
    return r'contactsListProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<PaginatedResponse<ContactItem>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<PaginatedResponse<ContactItem>> create(Ref ref) {
    final argument =
        this.argument
            as ({
              int page,
              String? search,
              String? status,
              String? priority,
              bool? unreadOnly,
            });
    return contactsList(
      ref,
      page: argument.page,
      search: argument.search,
      status: argument.status,
      priority: argument.priority,
      unreadOnly: argument.unreadOnly,
    );
  }

  @override
  bool operator ==(Object other) {
    return other is ContactsListProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$contactsListHash() => r'fba71b9a3fe6e4d0237c687f9d2fd3caa97e1c7b';

final class ContactsListFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<PaginatedResponse<ContactItem>>,
          ({
            int page,
            String? search,
            String? status,
            String? priority,
            bool? unreadOnly,
          })
        > {
  ContactsListFamily._()
    : super(
        retry: null,
        name: r'contactsListProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  ContactsListProvider call({
    int page = 1,
    String? search,
    String? status,
    String? priority,
    bool? unreadOnly,
  }) => ContactsListProvider._(
    argument: (
      page: page,
      search: search,
      status: status,
      priority: priority,
      unreadOnly: unreadOnly,
    ),
    from: this,
  );

  @override
  String toString() => r'contactsListProvider';
}

@ProviderFor(contactDetail)
final contactDetailProvider = ContactDetailFamily._();

final class ContactDetailProvider
    extends
        $FunctionalProvider<
          AsyncValue<ContactDetail>,
          ContactDetail,
          FutureOr<ContactDetail>
        >
    with $FutureModifier<ContactDetail>, $FutureProvider<ContactDetail> {
  ContactDetailProvider._({
    required ContactDetailFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'contactDetailProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$contactDetailHash();

  @override
  String toString() {
    return r'contactDetailProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<ContactDetail> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<ContactDetail> create(Ref ref) {
    final argument = this.argument as String;
    return contactDetail(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is ContactDetailProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$contactDetailHash() => r'7abb27bd245c33b1e476ba859de7a1b662311b8b';

final class ContactDetailFamily extends $Family
    with $FunctionalFamilyOverride<FutureOr<ContactDetail>, String> {
  ContactDetailFamily._()
    : super(
        retry: null,
        name: r'contactDetailProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  ContactDetailProvider call(String id) =>
      ContactDetailProvider._(argument: id, from: this);

  @override
  String toString() => r'contactDetailProvider';
}
