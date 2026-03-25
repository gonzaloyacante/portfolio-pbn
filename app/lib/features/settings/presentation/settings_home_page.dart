import 'dart:io';
import 'dart:math' as math;

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/utils/app_logger.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/app_snack_bar.dart';
import '../../../shared/widgets/color_picker_field.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/font_picker_field.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';
import 'widgets/collapsible_preview.dart';
import 'widgets/featured_count_picker.dart';
import 'widgets/hero_image_picker.dart';
import 'widgets/preview_image_placeholder.dart';
import 'widgets/sticky_preview_column.dart';

class SettingsHomePage extends ConsumerStatefulWidget {
  const SettingsHomePage({super.key});

  @override
  ConsumerState<SettingsHomePage> createState() => _SettingsHomePageState();
}

class _SettingsHomePageState extends ConsumerState<SettingsHomePage> {
  bool _saving = false;
  bool _populated = false;

  // Hero
  final _title1Ctrl = TextEditingController();
  final _title2Ctrl = TextEditingController();
  final _ownerNameCtrl = TextEditingController();
  final _heroImageCtrl = TextEditingController();
  final _heroImageAltCtrl = TextEditingController();
  File? _pendingHeroImage;

  // CTA
  final _ctaTextCtrl = TextEditingController();
  final _ctaLinkCtrl = TextEditingController();

  // Featured
  bool _showFeatured = true;
  final _featuredTitleCtrl = TextEditingController();
  int _featuredCount = 3;

  // Illustration
  File? _pendingIllustration;

  // Extended design fields (fonts, font URLs, colors, caption, alt texts)
  final Map<String, TextEditingController> _extraCtrls = {};

  // Numeric / enum design values (font sizes, z-indexes, offsets, styles…)
  final Map<String, dynamic> _vals = {};

  TextEditingController _ctrl(String key) =>
      _extraCtrls.putIfAbsent(key, TextEditingController.new);

  int _intVal(String key, [int fallback = 0]) =>
      (_vals[key] as int?) ?? fallback;

  String _strVal(String key, [String fallback = '']) =>
      (_vals[key] as String?) ?? fallback;

  void _setVal(String key, dynamic v) => setState(() => _vals[key] = v);

  @override
  void initState() {
    super.initState();
    // Escuchamos cambios en los controllers para refrescar el live preview
    for (final ctrl in [
      _title1Ctrl,
      _title2Ctrl,
      _ownerNameCtrl,
      _ctaTextCtrl,
    ]) {
      ctrl.addListener(_onPreviewChange);
    }
  }

  void _onPreviewChange() => setState(() {});

  @override
  void dispose() {
    for (final ctrl in [
      _title1Ctrl,
      _title2Ctrl,
      _ownerNameCtrl,
      _ctaTextCtrl,
    ]) {
      ctrl.removeListener(_onPreviewChange);
    }
    _title1Ctrl.dispose();
    _title2Ctrl.dispose();
    _ownerNameCtrl.dispose();
    _heroImageCtrl.dispose();
    _heroImageAltCtrl.dispose();
    _ctaTextCtrl.dispose();
    _ctaLinkCtrl.dispose();
    _featuredTitleCtrl.dispose();
    for (final c in _extraCtrls.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _populate(HomeSettings s) {
    if (_populated) return;
    _populated = true;

    // Core text controllers
    _title1Ctrl.text = s.heroTitle1Text ?? '';
    _title2Ctrl.text = s.heroTitle2Text ?? '';
    _ownerNameCtrl.text = s.ownerNameText ?? '';
    _heroImageCtrl.text = s.heroMainImageUrl ?? '';
    _heroImageAltCtrl.text = s.heroMainImageAlt ?? '';
    _ctaTextCtrl.text = s.ctaText ?? '';
    _ctaLinkCtrl.text = s.ctaLink ?? '';
    _showFeatured = s.showFeaturedProjects;
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

  // ── Image picker ─────────────────────────────────────────────────────────

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

  // ── Illustration picker ──────────────────────────────────────────────────

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

  // ── Save ─────────────────────────────────────────────────────────────────

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

      final data = <String, dynamic>{
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
        'showFeaturedProjects': _showFeatured,
        'featuredCount': _featuredCount,
        // Extra text controllers (fonts, colors, caption, alt…)
        for (final e in _extraCtrls.entries) e.key: _nullIfEmpty(e.value.text),
        // Numeric / enum vals (font sizes, z-indexes, offsets, styles…)
        ..._vals,
      };

      await ref.read(settingsRepositoryProvider).updateHome(data);

      ref.invalidate(homeSettingsProvider);
      if (mounted) {
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

  // ── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(homeSettingsProvider);

    return AppScaffold(
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
            _populate(settings);
            return _buildForm(context);
          },
        ),
      ),
    );
  }

  // ── Shimmer ───────────────────────────────────────────────────────────────

  // ── Form ─────────────────────────────────────────────────────────────────-

  Widget _buildForm(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    final isExpanded = AppBreakpoints.isExpanded(context);
    final maxWidth = AppBreakpoints.value<double>(
      context,
      compact: double.infinity,
      medium: 760,
      expanded: 1200,
    );

    final formContent = _buildFormContent(context);

    return SingleChildScrollView(
      padding: padding,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: isExpanded
              // ── Tablet: form izquierda + preview derecha ────────────
              ? Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 58,
                      child: Padding(
                        padding: EdgeInsets.zero,
                        child: formContent,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.xl),
                    Expanded(
                      flex: 42,
                      child: StickyPreviewColumn(
                        preview: _buildHeroPreview(context),
                      ),
                    ),
                  ],
                )
              // ── Mobile/medium: form + preview colapsable ────────────
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Preview colapsable en mobile
                    CollapsiblePreview(preview: _buildHeroPreview(context)),
                    const SizedBox(height: AppSpacing.md),
                    formContent,
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildFormContent(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildHeroTextsSection(),
        const SizedBox(height: AppSpacing.md),
        _buildHeroImageSection(),
        const SizedBox(height: AppSpacing.md),
        _buildIllustrationSection(),
        const SizedBox(height: AppSpacing.md),
        _buildCtaSection(),
        const SizedBox(height: AppSpacing.md),
        _buildFeaturedSection(),
        const SizedBox(height: AppSpacing.md),
        _buildPositionSection(),
        const SizedBox(height: AppSpacing.md),
        _buildMobileSection(),
        const SizedBox(height: AppSpacing.xl),
        FilledButton.icon(
          onPressed: _saving ? null : _save,
          icon: const Icon(Icons.save_outlined),
          label: const Text('Guardar cambios'),
        ),
        const SizedBox(height: AppSpacing.base),
      ],
    );
  }

  // ── Section 1: Hero Texts ─────────────────────────────────────────────────

  Widget _buildHeroTextsSection() {
    return SettingsFormCard(
      title: 'Textos del Hero',
      leadingIcon: Icons.title_rounded,
      children: [
        TextFormField(
          controller: _title1Ctrl,
          decoration: const InputDecoration(
            labelText: 'Título principal',
            hintText: 'Ej: "Make-up"',
            prefixIcon: Icon(Icons.format_size),
          ),
        ),
        _buildTextDesign('heroTitle1', fontSizeFallback: 112),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _title2Ctrl,
          decoration: const InputDecoration(
            labelText: 'Segundo título',
            hintText: 'Ej: "Artist"',
            prefixIcon: Icon(Icons.format_size),
          ),
        ),
        _buildTextDesign('heroTitle2', fontSizeFallback: 96),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ownerNameCtrl,
          decoration: const InputDecoration(
            labelText: 'Nombre de la artista',
            hintText: 'Ej: "Paola Bolívar Nievas"',
            prefixIcon: Icon(Icons.person_outline),
          ),
        ),
        _buildTextDesign('ownerName', fontSizeFallback: 36),
      ],
    );
  }

  // ── Section 2: Hero Image ─────────────────────────────────────────────────

  Widget _buildHeroImageSection() {
    return SettingsFormCard(
      title: 'Foto del Hero',
      leadingIcon: Icons.image_outlined,
      children: [
        HeroImagePicker(
          imageUrl: _heroImageCtrl.text,
          pendingFile: _pendingHeroImage,
          onPick: _pickHeroImage,
          onRemove: _removeHeroImage,
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _heroImageAltCtrl,
          decoration: const InputDecoration(
            labelText: 'Texto alternativo (accesibilidad)',
            hintText: 'Ej: "Foto de Paola maquillando"',
            prefixIcon: Icon(Icons.accessibility_new_outlined),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctrl('heroMainImageCaption'),
          decoration: const InputDecoration(
            labelText: 'Pie de foto (opcional)',
            hintText: 'Ej: "Sesión en Barcelona"',
            prefixIcon: Icon(Icons.closed_caption_outlined),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        DropdownButtonFormField<String>(
          value: _strVal('heroImageStyle', 'original'),
          decoration: const InputDecoration(
            labelText: 'Estilo de imagen',
            prefixIcon: Icon(Icons.crop_outlined),
          ),
          items: const [
            DropdownMenuItem(value: 'original', child: Text('Original')),
            DropdownMenuItem(value: 'rounded', child: Text('Redondeado')),
            DropdownMenuItem(value: 'square', child: Text('Cuadrado')),
            DropdownMenuItem(value: 'circle', child: Text('Circular')),
            DropdownMenuItem(value: 'landscape', child: Text('Horizontal')),
            DropdownMenuItem(value: 'portrait', child: Text('Retrato')),
            DropdownMenuItem(value: 'star', child: Text('Estrella')),
          ],
          onChanged: (v) => _setVal('heroImageStyle', v),
        ),
      ],
    );
  }

  // ── Section 3: Illustration ───────────────────────────────────────────────

  Widget _buildIllustrationSection() {
    final illustrationUrl = (_vals['illustrationUrl'] as String?) ?? '';

    return SettingsFormCard(
      title: 'Ilustración decorativa',
      leadingIcon: Icons.brush_outlined,
      children: [
        HeroImagePicker(
          imageUrl: illustrationUrl,
          pendingFile: _pendingIllustration,
          onPick: _pickIllustration,
          onRemove: _removeIllustration,
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctrl('illustrationAlt'),
          decoration: const InputDecoration(
            labelText: 'Texto alternativo',
            hintText: 'Ej: "Ilustración maquilladora"',
            prefixIcon: Icon(Icons.accessibility_new_outlined),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        _buildSlider(
          'illustrationOpacity',
          'Opacidad',
          min: 0,
          max: 100,
          fallback: 100,
          suffix: '%',
        ),
        _buildSlider(
          'illustrationSize',
          'Tamaño',
          min: 10,
          max: 500,
          fallback: 100,
          suffix: '%',
        ),
        _buildSlider(
          'illustrationRotation',
          'Rotación',
          min: -180,
          max: 180,
          fallback: 0,
          suffix: '°',
        ),
      ],
    );
  }

  // ── Section 4: CTA ────────────────────────────────────────────────────────

  Widget _buildCtaSection() {
    return SettingsFormCard(
      title: 'Botón de acción (CTA)',
      leadingIcon: Icons.touch_app_outlined,
      children: [
        TextFormField(
          controller: _ctaTextCtrl,
          decoration: const InputDecoration(
            labelText: 'Texto del botón',
            hintText: 'Ej: "Ver proyectos"',
            prefixIcon: Icon(Icons.smart_button_outlined),
          ),
        ),
        const SizedBox(height: AppSpacing.md),
        TextFormField(
          controller: _ctaLinkCtrl,
          keyboardType: TextInputType.url,
          decoration: const InputDecoration(
            labelText: 'Enlace destino',
            hintText: 'Ej: "/proyectos"',
            prefixIcon: Icon(Icons.link_outlined),
          ),
        ),
        _buildTextDesignCta(),
        const SizedBox(height: AppSpacing.md),
        DropdownButtonFormField<String>(
          value: _strVal('ctaVariant', 'default'),
          decoration: const InputDecoration(
            labelText: 'Variante',
            prefixIcon: Icon(Icons.style_outlined),
          ),
          items: const [
            DropdownMenuItem(value: 'default', child: Text('Primario')),
            DropdownMenuItem(value: 'secondary', child: Text('Secundario')),
            DropdownMenuItem(value: 'outline', child: Text('Contorno')),
            DropdownMenuItem(value: 'ghost', child: Text('Fantasma')),
          ],
          onChanged: (v) => _setVal('ctaVariant', v),
        ),
        const SizedBox(height: AppSpacing.md),
        DropdownButtonFormField<String>(
          value: _strVal('ctaSize', 'default'),
          decoration: const InputDecoration(
            labelText: 'Tamaño del botón',
            prefixIcon: Icon(Icons.format_size_outlined),
          ),
          items: const [
            DropdownMenuItem(value: 'sm', child: Text('Pequeño')),
            DropdownMenuItem(value: 'default', child: Text('Mediano')),
            DropdownMenuItem(value: 'lg', child: Text('Grande')),
          ],
          onChanged: (v) => _setVal('ctaSize', v),
        ),
      ],
    );
  }

  // ── Section 5: Featured Projects ──────────────────────────────────────────

  Widget _buildFeaturedSection() {
    return SettingsFormCard(
      title: 'Proyectos destacados',
      leadingIcon: Icons.star_outline_rounded,
      children: [
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Mostrar sección de destacados'),
          subtitle: const Text(
            'Aparece debajo del Hero en la página de inicio',
          ),
          value: _showFeatured,
          onChanged: (v) => setState(() => _showFeatured = v),
        ),
        if (_showFeatured) ...[
          const Divider(height: AppSpacing.xl),
          TextFormField(
            controller: _featuredTitleCtrl,
            decoration: const InputDecoration(
              labelText: 'Título de la sección',
              hintText: 'Ej: "Trabajos recientes"',
              prefixIcon: Icon(Icons.title_outlined),
            ),
          ),
          _buildTextDesign('featuredTitle', fontSizeFallback: 32),
          const SizedBox(height: AppSpacing.md),
          FeaturedCountPicker(
            value: _featuredCount,
            onChanged: (v) => setState(() => _featuredCount = v),
          ),
          const SizedBox(height: AppSpacing.md),
          OutlinedButton.icon(
            onPressed: () => context.pushNamed(RouteNames.projects),
            icon: const Icon(Icons.open_in_new_rounded, size: 16),
            label: const Text('Ordenar proyectos →'),
          ),
        ],
      ],
    );
  }

  // ── Section 6: Position & Layers ──────────────────────────────────────────

  Widget _buildPositionSection() {
    return SettingsFormCard(
      title: 'Posición y capas',
      leadingIcon: Icons.layers_outlined,
      children: [
        Text(
          'Ajusta la profundidad (z-index) y posición de cada elemento.',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(
              context,
            ).colorScheme.onSurface.withValues(alpha: 0.6),
          ),
        ),
        _buildPositionBlock('Título 1', 'heroTitle1', zFallback: 20),
        _buildPositionBlock('Título 2', 'heroTitle2', zFallback: 10),
        _buildPositionBlock('Nombre', 'ownerName', zFallback: 15),
        _buildPositionBlock('Imagen hero', 'heroMainImage', zFallback: 5),
        _buildPositionBlock('Ilustración', 'illustration', zFallback: 10),
        _buildPositionBlockNoZ('Botón CTA', 'cta'),
      ],
    );
  }

  // ── Section 7: Mobile Overrides ──────────────────────────────────────────

  Widget _buildMobileSection() {
    return SettingsFormCard(
      title: 'Ajustes móviles',
      leadingIcon: Icons.smartphone_outlined,
      children: [
        Text(
          'Sobreescribe valores para pantallas pequeñas.',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(
              context,
            ).colorScheme.onSurface.withValues(alpha: 0.6),
          ),
        ),
        _buildMobileBlock('Título 1', 'heroTitle1', fontSizeFallback: 56),
        _buildMobileBlock('Título 2', 'heroTitle2', fontSizeFallback: 72),
        _buildMobileBlock('Nombre', 'ownerName', fontSizeFallback: 28),
        _buildMobileBlockOffset('Imagen hero', 'heroMainImage'),
        _buildMobileBlockIllustration(),
        _buildMobileBlock('Botón CTA', 'cta', fontSizeFallback: 16),
      ],
    );
  }

  // ── Reusable helpers ──────────────────────────────────────────────────────

  /// Expandable font, size & color panel for a text element.
  Widget _buildTextDesign(String prefix, {int fontSizeFallback = 16}) {
    final fontKey = '${prefix}Font';
    final fontUrlKey = '${prefix}FontUrl';
    final sizeKey = '${prefix}FontSize';
    final colorKey = '${prefix}Color';
    final colorDarkKey = '${prefix}ColorDark';

    return ExpansionTile(
      title: const Text('Personalizar tipografía'),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        FontPickerField(
          value: _ctrl(fontKey).text.isEmpty ? null : _ctrl(fontKey).text,
          onChanged: (name, url) => setState(() {
            _ctrl(fontKey).text = name;
            _ctrl(fontUrlKey).text = url;
          }),
        ),
        const SizedBox(height: AppSpacing.md),
        _buildSlider(
          sizeKey,
          'Tamaño',
          min: 8,
          max: 200,
          fallback: fontSizeFallback,
        ),
        const SizedBox(height: AppSpacing.md),
        ColorPickerField(controller: _ctrl(colorKey), label: 'Color (claro)'),
        const SizedBox(height: AppSpacing.md),
        ColorPickerField(
          controller: _ctrl(colorDarkKey),
          label: 'Color (oscuro)',
        ),
      ],
    );
  }

  /// CTA font design — font + size (no colors, CTA colors come from variant).
  Widget _buildTextDesignCta() {
    return ExpansionTile(
      title: const Text('Personalizar tipografía'),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        FontPickerField(
          value: _ctrl('ctaFont').text.isEmpty ? null : _ctrl('ctaFont').text,
          onChanged: (name, url) => setState(() {
            _ctrl('ctaFont').text = name;
            _ctrl('ctaFontUrl').text = url;
          }),
        ),
        const SizedBox(height: AppSpacing.md),
        _buildSlider('ctaFontSize', 'Tamaño', min: 8, max: 48, fallback: 16),
      ],
    );
  }

  /// Position block with z-index + offsets.
  Widget _buildPositionBlock(String label, String prefix, {int zFallback = 0}) {
    return ExpansionTile(
      title: Text(label),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider(
          '${prefix}ZIndex',
          'Z-Index',
          min: 0,
          max: 50,
          fallback: zFallback,
        ),
        _buildSlider('${prefix}OffsetX', 'Desplazar X', min: -200, max: 200),
        _buildSlider('${prefix}OffsetY', 'Desplazar Y', min: -200, max: 200),
      ],
    );
  }

  /// Position block without z-index (e.g. CTA).
  Widget _buildPositionBlockNoZ(String label, String prefix) {
    return ExpansionTile(
      title: Text(label),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider('${prefix}OffsetX', 'Desplazar X', min: -200, max: 200),
        _buildSlider('${prefix}OffsetY', 'Desplazar Y', min: -200, max: 200),
      ],
    );
  }

  /// Mobile block with font size + offsets (text elements + CTA).
  Widget _buildMobileBlock(
    String label,
    String prefix, {
    int fontSizeFallback = 16,
  }) {
    return ExpansionTile(
      title: Text(label),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider(
          '${prefix}MobileFontSize',
          'Tamaño fuente',
          min: 8,
          max: 120,
          fallback: fontSizeFallback,
        ),
        _buildSlider(
          '${prefix}MobileOffsetX',
          'Desplazar X',
          min: -200,
          max: 200,
        ),
        _buildSlider(
          '${prefix}MobileOffsetY',
          'Desplazar Y',
          min: -200,
          max: 200,
        ),
      ],
    );
  }

  /// Mobile block with offset only (hero image).
  Widget _buildMobileBlockOffset(String label, String prefix) {
    return ExpansionTile(
      title: Text(label),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider(
          '${prefix}MobileOffsetX',
          'Desplazar X',
          min: -200,
          max: 200,
        ),
        _buildSlider(
          '${prefix}MobileOffsetY',
          'Desplazar Y',
          min: -200,
          max: 200,
        ),
      ],
    );
  }

  /// Mobile block for illustration (offset + size + rotation).
  Widget _buildMobileBlockIllustration() {
    return ExpansionTile(
      title: const Text('Ilustración'),
      tilePadding: EdgeInsets.zero,
      childrenPadding: const EdgeInsets.only(bottom: 8),
      children: [
        _buildSlider(
          'illustrationMobileOffsetX',
          'Desplazar X',
          min: -200,
          max: 200,
        ),
        _buildSlider(
          'illustrationMobileOffsetY',
          'Desplazar Y',
          min: -200,
          max: 200,
        ),
        _buildSlider(
          'illustrationMobileSize',
          'Tamaño',
          min: 10,
          max: 200,
          fallback: 60,
          suffix: '%',
        ),
        _buildSlider(
          'illustrationMobileRotation',
          'Rotación',
          min: -180,
          max: 180,
          suffix: '°',
        ),
      ],
    );
  }

  /// Labeled slider backed by _vals[key].
  Widget _buildSlider(
    String key,
    String label, {
    required double min,
    required double max,
    int fallback = 0,
    String suffix = 'px',
  }) {
    final val = _intVal(key, fallback);
    final clamped = val.toDouble().clamp(min, max);
    final colorScheme = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: Theme.of(context).textTheme.labelLarge),
              Text(
                '$val $suffix',
                style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          Slider(
            value: clamped,
            min: min,
            max: max,
            divisions: (max - min).round(),
            onChanged: (v) => _setVal(key, v.round()),
          ),
        ],
      ),
    );
  }

  // ── Hero Preview ──────────────────────────────────────────────────────────

  Widget _buildHeroPreview(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final theme = Theme.of(context);
    final title1 = _title1Ctrl.text.isNotEmpty ? _title1Ctrl.text : 'Make-up';
    final title2 = _title2Ctrl.text.isNotEmpty ? _title2Ctrl.text : 'Portfolio';
    final owner = _ownerNameCtrl.text.isNotEmpty
        ? _ownerNameCtrl.text
        : 'Paola Bolívar Nievas';
    final cta = _ctaTextCtrl.text.isNotEmpty
        ? _ctaTextCtrl.text
        : 'Ver proyectos';
    final hasPending = _pendingHeroImage != null;
    final hasUrl = _heroImageCtrl.text.isNotEmpty;

    Widget buildImage() {
      if (hasPending) {
        return Image.file(_pendingHeroImage!, fit: BoxFit.cover);
      }
      if (hasUrl) {
        return CachedNetworkImage(
          imageUrl: _heroImageCtrl.text,
          fit: BoxFit.cover,
          errorWidget: (_, url, error) =>
              PreviewImagePlaceholder(color: colorScheme),
        );
      }
      return PreviewImagePlaceholder(color: colorScheme);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.web_outlined, size: 16, color: colorScheme.primary),
            const SizedBox(width: 6),
            Text(
              'Vista previa',
              style: theme.textTheme.labelMedium?.copyWith(
                color: colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        // Website mockup — 2-column layout matching the web HeroContent
        LayoutBuilder(
          builder: (context, constraints) {
            final w = constraints.maxWidth;
            final s = math.max(0.5, math.min(1.0, w / 400));

            return DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: colorScheme.outline.withValues(alpha: 80 / 255),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 16 / 255),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Browser chrome bar
                    Container(
                      height: 20 * s,
                      padding: EdgeInsets.symmetric(horizontal: 8 * s),
                      color: colorScheme.surfaceContainerHighest,
                      child: Row(
                        children: [
                          for (final c in const [
                            Color(0xFFFF5F57),
                            Color(0xFFFFBD2E),
                            Color(0xFF28CA41),
                          ])
                            Padding(
                              padding: EdgeInsets.only(right: 3 * s),
                              child: CircleAvatar(
                                radius: 3 * s,
                                backgroundColor: c,
                              ),
                            ),
                        ],
                      ),
                    ),
                    // Hero section — 2-column grid (5 / 7) like web
                    Container(
                      color: AppColors.lightBackground,
                      padding: EdgeInsets.symmetric(
                        horizontal: 16 * s,
                        vertical: 20 * s,
                      ),
                      child: IntrinsicHeight(
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            // Left column: titles + owner signature
                            Expanded(
                              flex: 5,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  // Title 1 — Great Vibes (decorative)
                                  Text(
                                    title1,
                                    style: GoogleFonts.greatVibes(
                                      fontSize: 26 * s,
                                      color: AppColors.lightPrimary,
                                      height: 0.9,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  // Title 2 — Poppins bold, accent tint
                                  Text(
                                    title2,
                                    style: GoogleFonts.poppins(
                                      fontSize: 20 * s,
                                      fontWeight: FontWeight.w800,
                                      color: AppColors.lightPrimary.withValues(
                                        alpha: 50 / 255,
                                      ),
                                      height: 1.0,
                                      letterSpacing: -0.5,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  SizedBox(height: 16 * s),
                                  // Owner signature
                                  Text(
                                    owner,
                                    style: GoogleFonts.poppins(
                                      fontSize: 7 * s,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 2.0,
                                      color: AppColors.lightForeground,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(width: 8 * s),
                            // Right column: hero image + CTA
                            Expanded(
                              flex: 7,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  AspectRatio(
                                    aspectRatio: 4 / 5,
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(
                                        12 * s,
                                      ),
                                      child: buildImage(),
                                    ),
                                  ),
                                  SizedBox(height: 8 * s),
                                  Container(
                                    padding: EdgeInsets.symmetric(
                                      horizontal: 10 * s,
                                      vertical: 5 * s,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppColors.lightPrimary,
                                      borderRadius: BorderRadius.circular(
                                        14 * s,
                                      ),
                                    ),
                                    child: Text(
                                      cta,
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 9 * s,
                                        fontWeight: FontWeight.w600,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'Se actualiza en tiempo real mientras editas',
          style: theme.textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurface.withValues(alpha: 100 / 255),
            fontStyle: FontStyle.italic,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
