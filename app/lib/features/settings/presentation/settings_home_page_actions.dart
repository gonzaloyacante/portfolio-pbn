part of 'settings_home_page.dart';

extension _HomePageActions on _SettingsHomePageState {
  // ── State helpers ──────────────────────────────────────────────────────

  void _setPreviewDevice(String device) {
    setState(() => _previewDevice = device);
  }

  void _togglePreviewDarkMode() {
    setState(() => _previewDarkMode = !_previewDarkMode);
  }

  TextEditingController _ctrl(String key) =>
      _extraCtrls.putIfAbsent(key, TextEditingController.new);

  int _intVal(String key, [int fallback = 0]) =>
      (_vals[key] as num?)?.toInt() ?? fallback;

  String _strVal(String key, [String fallback = '']) =>
      (_vals[key] as String?) ?? fallback;

  void _setVal(String key, Object? v) => setState(() => _vals[key] = v);

  void _onPreviewChange() {
    _markDirty();
    setState(() {});
  }

  // ── Navigation ─────────────────────────────────────────────────────────

  Future<void> _maybeLeave(BuildContext context) async {
    if (!_isDirty) {
      context.pop();
      return;
    }
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => const ConfirmDialog(
        title: '¿Salir sin guardar?',
        message: 'Tienes cambios sin guardar.',
        confirmLabel: 'Salir',
        cancelLabel: 'Continuar editando',
      ),
    );
    if (confirmed == true && context.mounted) context.pop();
  }

  // ── Populate ───────────────────────────────────────────────────────────

  void _populate(HomeSettings s) {
    // Core text controllers
    _title1Ctrl.text = s.heroTitle1Text ?? '';
    _title2Ctrl.text = s.heroTitle2Text ?? '';
    _ownerNameCtrl.text = s.ownerNameText ?? '';
    _heroImageCtrl.text = s.heroMainImageUrl ?? '';
    _heroImageAltCtrl.text = s.heroMainImageAlt ?? '';
    _ctaTextCtrl.text = s.ctaText ?? '';
    _ctaLinkCtrl.text = s.ctaLink ?? '';
    _showFeatured = s.showFeaturedImages;
    _featuredTitleCtrl.text = s.featuredTitle ?? '';
    _featuredCount = s.featuredCount.clamp(1, 9);

    // Extra text controllers — fonts, font URLs, colors, caption, alt
    _ctrl('heroTitle1Font').text = s.heroTitle1Font ?? '';
    _ctrl('heroTitle1FontUrl').text = s.heroTitle1FontUrl ?? '';
    _ctrl('heroTitle1Color').text = s.heroTitle1Color ?? '';
    _ctrl('heroTitle1ColorDark').text = s.heroTitle1ColorDark ?? '';
    _ctrl('heroTitle2Font').text = s.heroTitle2Font ?? '';
    _ctrl('heroTitle2FontUrl').text = s.heroTitle2FontUrl ?? '';
    _ctrl('heroTitle2Color').text = s.heroTitle2Color ?? '';
    _ctrl('heroTitle2ColorDark').text = s.heroTitle2ColorDark ?? '';
    _ctrl('ownerNameFont').text = s.ownerNameFont ?? '';
    _ctrl('ownerNameFontUrl').text = s.ownerNameFontUrl ?? '';
    _ctrl('ownerNameColor').text = s.ownerNameColor ?? '';
    _ctrl('ownerNameColorDark').text = s.ownerNameColorDark ?? '';
    _ctrl('heroMainImageCaption').text = s.heroMainImageCaption ?? '';
    _ctrl('illustrationAlt').text = s.illustrationAlt ?? '';
    _ctrl('ctaFont').text = s.ctaFont ?? '';
    _ctrl('ctaFontUrl').text = s.ctaFontUrl ?? '';
    _ctrl('featuredTitleFont').text = s.featuredTitleFont ?? '';
    _ctrl('featuredTitleFontUrl').text = s.featuredTitleFontUrl ?? '';
    _ctrl('featuredTitleColor').text = s.featuredTitleColor ?? '';
    _ctrl('featuredTitleColorDark').text = s.featuredTitleColorDark ?? '';

    // Numeric / enum values
    _vals.addAll({
      'showHeroTitle1': s.showHeroTitle1,
      'showHeroTitle2': s.showHeroTitle2,
      'showOwnerName': s.showOwnerName,
      'heroTitle1FontSize': s.heroTitle1FontSize,
      'heroTitle1ZIndex': s.heroTitle1ZIndex,
      'heroTitle1OffsetX': s.heroTitle1OffsetX,
      'heroTitle1OffsetY': s.heroTitle1OffsetY,
      'heroTitle2FontSize': s.heroTitle2FontSize,
      'heroTitle2ZIndex': s.heroTitle2ZIndex,
      'heroTitle2OffsetX': s.heroTitle2OffsetX,
      'heroTitle2OffsetY': s.heroTitle2OffsetY,
      'ownerNameFontSize': s.ownerNameFontSize,
      'ownerNameZIndex': s.ownerNameZIndex,
      'ownerNameOffsetX': s.ownerNameOffsetX,
      'ownerNameOffsetY': s.ownerNameOffsetY,
      'heroImageStyle': s.heroImageStyle ?? 'original',
      'heroMainImageZIndex': s.heroMainImageZIndex,
      'heroMainImageOffsetX': s.heroMainImageOffsetX,
      'heroMainImageOffsetY': s.heroMainImageOffsetY,
      'illustrationUrl': s.illustrationUrl,
      'illustrationZIndex': s.illustrationZIndex,
      'illustrationOpacity': s.illustrationOpacity,
      'illustrationSize': s.illustrationSize,
      'illustrationOffsetX': s.illustrationOffsetX,
      'illustrationOffsetY': s.illustrationOffsetY,
      'illustrationRotation': s.illustrationRotation,
      'ctaFontSize': s.ctaFontSize,
      'ctaVariant': s.ctaVariant ?? 'default',
      'ctaSize': s.ctaSize ?? 'default',
      'ctaOffsetX': s.ctaOffsetX,
      'ctaOffsetY': s.ctaOffsetY,
      'heroTitle1MobileOffsetX': s.heroTitle1MobileOffsetX,
      'heroTitle1MobileOffsetY': s.heroTitle1MobileOffsetY,
      'heroTitle1MobileFontSize': s.heroTitle1MobileFontSize,
      'heroTitle2MobileOffsetX': s.heroTitle2MobileOffsetX,
      'heroTitle2MobileOffsetY': s.heroTitle2MobileOffsetY,
      'heroTitle2MobileFontSize': s.heroTitle2MobileFontSize,
      'ownerNameMobileOffsetX': s.ownerNameMobileOffsetX,
      'ownerNameMobileOffsetY': s.ownerNameMobileOffsetY,
      'ownerNameMobileFontSize': s.ownerNameMobileFontSize,
      'heroMainImageMobileOffsetX': s.heroMainImageMobileOffsetX,
      'heroMainImageMobileOffsetY': s.heroMainImageMobileOffsetY,
      'illustrationMobileOffsetX': s.illustrationMobileOffsetX,
      'illustrationMobileOffsetY': s.illustrationMobileOffsetY,
      'illustrationMobileSize': s.illustrationMobileSize,
      'illustrationMobileRotation': s.illustrationMobileRotation,
      'ctaMobileOffsetX': s.ctaMobileOffsetX,
      'ctaMobileOffsetY': s.ctaMobileOffsetY,
      'ctaMobileFontSize': s.ctaMobileFontSize,
      'featuredTitleFontSize': s.featuredTitleFontSize,
    });
  }

  String? _nullIfEmpty(String v) => v.trim().isEmpty ? null : v.trim();

  // ── Image pickers ──────────────────────────────────────────────────────

  Future<void> _pickHeroImage() async {
    try {
      final picker = ImagePicker();
      final primaryColor = Theme.of(context).colorScheme.primary;
      final picked = await picker.pickImage(source: ImageSource.gallery);
      if (picked == null) return;

      final cropped = await ImageCropper().cropImage(
        sourcePath: picked.path,
        compressQuality: 85,
        uiSettings: [
          AndroidUiSettings(
            toolbarTitle: 'Recortar imagen hero',
            toolbarColor: primaryColor,
            toolbarWidgetColor: Colors.white,
            initAspectRatio: CropAspectRatioPreset.original,
            lockAspectRatio: false,
          ),
          IOSUiSettings(title: 'Recortar imagen hero'),
        ],
      );

      if (cropped != null) {
        setState(() {
          _pendingHeroImage = File(cropped.path);
          _heroImageCtrl.text = cropped.path;
        });
      }
    } catch (e) {
      AppLogger.error('SettingsHomePage: error picking hero image', e);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudo seleccionar la imagen')),
        );
      }
    }
  }

  void _removeHeroImage() {
    setState(() {
      _pendingHeroImage = null;
      _heroImageCtrl.text = '';
    });
  }

  Future<void> _pickIllustration() async {
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(source: ImageSource.gallery);
      if (picked == null) return;
      setState(() {
        _pendingIllustration = File(picked.path);
        _vals['illustrationUrl'] = picked.path;
      });
    } catch (e) {
      AppLogger.error('SettingsHomePage: error picking illustration', e);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudo seleccionar la imagen')),
        );
      }
    }
  }

  void _removeIllustration() {
    setState(() {
      _pendingIllustration = null;
      _vals['illustrationUrl'] = null;
    });
  }

  // ── Save ───────────────────────────────────────────────────────────────

  Future<void> _save() async {
    if (!mounted) return;
    setState(() => _saving = true);
    try {
      final svc = ref.read(uploadServiceProvider);

      if (_pendingHeroImage != null) {
        final result = await svc.uploadImageFull(
          _pendingHeroImage!,
          folder: 'portfolio/home',
        );
        _heroImageCtrl.text = result.url;
        _pendingHeroImage = null;
      }

      if (_pendingIllustration != null) {
        final result = await svc.uploadImageFull(
          _pendingIllustration!,
          folder: 'portfolio/home',
        );
        _vals['illustrationUrl'] = result.url;
        _pendingIllustration = null;
      }

      final data = <String, Object?>{
        'showHeroTitle1': _vals['showHeroTitle1'] ?? true,
        'showHeroTitle2': _vals['showHeroTitle2'] ?? true,
        'showOwnerName': _vals['showOwnerName'] ?? true,
        // Core text fields
        'heroTitle1Text': _nullIfEmpty(_title1Ctrl.text),
        'heroTitle2Text': _nullIfEmpty(_title2Ctrl.text),
        'ownerNameText': _nullIfEmpty(_ownerNameCtrl.text),
        'heroMainImageUrl': _nullIfEmpty(_heroImageCtrl.text),
        'heroMainImageAlt': _nullIfEmpty(_heroImageAltCtrl.text),
        'ctaText': _nullIfEmpty(_ctaTextCtrl.text),
        'ctaLink': _nullIfEmpty(_ctaLinkCtrl.text),
        'featuredTitle': _nullIfEmpty(_featuredTitleCtrl.text),
        // Non-text state
        'showFeaturedImages': _showFeatured,
        'featuredCount': _featuredCount,
        // Extra text controllers (fonts, colors, caption, alt…)
        for (final e in _extraCtrls.entries) e.key: _nullIfEmpty(e.value.text),
        // Numeric / enum vals (font sizes, z-indexes, offsets, styles…)
        ..._vals,
      };

      await ref.read(settingsRepositoryProvider).updateHome(data);

      ref.invalidate(homeSettingsProvider);
      if (mounted) {
        setState(() => _isDirty = false);
        AppSnackBar.success(context, 'Inicio guardado correctamente');
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        AppSnackBar.error(context, 'No se pudo guardar. Inténtalo de nuevo.');
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  // ── Scaffold ───────────────────────────────────────────────────────────

  Widget _buildScaffold(BuildContext context) {
    final async = ref.watch(homeSettingsProvider);

    ref.listen<AsyncValue<HomeSettings>>(homeSettingsProvider, (_, next) {
      next.whenData((settings) {
        if (!mounted || _populated || _isDirty) {
          return;
        }
        _populate(settings);
        _populated = true;
        setState(() {});
      });
    });

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, Object? result) =>
          _maybeLeave(context),
      child: AppScaffold(
        title: 'Página de inicio',
        actions: [
          IconButton(
            icon: const Icon(Icons.save_outlined),
            tooltip: 'Guardar',
            onPressed: _saving ? null : _save,
          ),
        ],
        body: LoadingOverlay(
          isLoading: _saving,
          child: async.when(
            loading: () =>
                const SkeletonSettingsPage(cardCount: 4, fieldsPerCard: 3),
            error: (e, _) => ErrorState(
              message: e.toString(),
              onRetry: () => ref.invalidate(homeSettingsProvider),
            ),
            data: (settings) {
              return RefreshIndicator(
                onRefresh: () async {
                  ref.invalidate(homeSettingsProvider);
                  final s = await ref.read(homeSettingsProvider.future);
                  if (!mounted || _isDirty) {
                    return;
                  }
                  _populate(s);
                  _populated = true;
                  setState(() {});
                },
                child: _buildForm(context),
              );
            },
          ),
        ),
      ),
    );
  }
}
