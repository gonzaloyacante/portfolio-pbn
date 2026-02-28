// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'settings_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(settingsRepository)
final settingsRepositoryProvider = SettingsRepositoryProvider._();

final class SettingsRepositoryProvider
    extends $FunctionalProvider<SettingsRepository, SettingsRepository, SettingsRepository>
    with $Provider<SettingsRepository> {
  SettingsRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'settingsRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$settingsRepositoryHash();

  @$internal
  @override
  $ProviderElement<SettingsRepository> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  SettingsRepository create(Ref ref) {
    return settingsRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SettingsRepository value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<SettingsRepository>(value));
  }
}

String _$settingsRepositoryHash() => r'4368f37c1789efa0923609e03cfeedc62a70af08';

@ProviderFor(aboutSettings)
final aboutSettingsProvider = AboutSettingsProvider._();

final class AboutSettingsProvider
    extends $FunctionalProvider<AsyncValue<AboutSettings>, AboutSettings, FutureOr<AboutSettings>>
    with $FutureModifier<AboutSettings>, $FutureProvider<AboutSettings> {
  AboutSettingsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'aboutSettingsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$aboutSettingsHash();

  @$internal
  @override
  $FutureProviderElement<AboutSettings> $createElement($ProviderPointer pointer) => $FutureProviderElement(pointer);

  @override
  FutureOr<AboutSettings> create(Ref ref) {
    return aboutSettings(ref);
  }
}

String _$aboutSettingsHash() => r'de3ee197d5af19c4df045e30f91cb37949c3e0fe';

@ProviderFor(contactSettings)
final contactSettingsProvider = ContactSettingsProvider._();

final class ContactSettingsProvider
    extends $FunctionalProvider<AsyncValue<ContactSettings>, ContactSettings, FutureOr<ContactSettings>>
    with $FutureModifier<ContactSettings>, $FutureProvider<ContactSettings> {
  ContactSettingsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'contactSettingsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$contactSettingsHash();

  @$internal
  @override
  $FutureProviderElement<ContactSettings> $createElement($ProviderPointer pointer) => $FutureProviderElement(pointer);

  @override
  FutureOr<ContactSettings> create(Ref ref) {
    return contactSettings(ref);
  }
}

String _$contactSettingsHash() => r'4daf67676a7b81940123d6bb338f7f9a8056af0a';

@ProviderFor(themeSettings)
final themeSettingsProvider = ThemeSettingsProvider._();

final class ThemeSettingsProvider
    extends $FunctionalProvider<AsyncValue<ThemeSettings>, ThemeSettings, FutureOr<ThemeSettings>>
    with $FutureModifier<ThemeSettings>, $FutureProvider<ThemeSettings> {
  ThemeSettingsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'themeSettingsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$themeSettingsHash();

  @$internal
  @override
  $FutureProviderElement<ThemeSettings> $createElement($ProviderPointer pointer) => $FutureProviderElement(pointer);

  @override
  FutureOr<ThemeSettings> create(Ref ref) {
    return themeSettings(ref);
  }
}

String _$themeSettingsHash() => r'df135a4764cedc9d86cce1b380a428a54288b3a5';

@ProviderFor(siteSettings)
final siteSettingsProvider = SiteSettingsProvider._();

final class SiteSettingsProvider
    extends $FunctionalProvider<AsyncValue<SiteSettings>, SiteSettings, FutureOr<SiteSettings>>
    with $FutureModifier<SiteSettings>, $FutureProvider<SiteSettings> {
  SiteSettingsProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'siteSettingsProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$siteSettingsHash();

  @$internal
  @override
  $FutureProviderElement<SiteSettings> $createElement($ProviderPointer pointer) => $FutureProviderElement(pointer);

  @override
  FutureOr<SiteSettings> create(Ref ref) {
    return siteSettings(ref);
  }
}

String _$siteSettingsHash() => r'bb4101134e9e70a0ab23e66043d8337e77d6c75e';

@ProviderFor(socialLinks)
final socialLinksProvider = SocialLinksProvider._();

final class SocialLinksProvider
    extends $FunctionalProvider<AsyncValue<List<SocialLink>>, List<SocialLink>, FutureOr<List<SocialLink>>>
    with $FutureModifier<List<SocialLink>>, $FutureProvider<List<SocialLink>> {
  SocialLinksProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'socialLinksProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$socialLinksHash();

  @$internal
  @override
  $FutureProviderElement<List<SocialLink>> $createElement($ProviderPointer pointer) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<SocialLink>> create(Ref ref) {
    return socialLinks(ref);
  }
}

String _$socialLinksHash() => r'6ee25cebb0dac38a0fbaf01cd0b92bf289f38d2c';
