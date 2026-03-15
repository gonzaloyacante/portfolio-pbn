import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/utils/app_logger.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/app_snack_bar.dart';
import '../../../shared/widgets/error_state.dart';
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
    super.dispose();
  }

  void _populate(HomeSettings s) {
    if (_populated) return;
    _populated = true;
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

  // ── Save ─────────────────────────────────────────────────────────────────

  Future<void> _save() async {
    if (!mounted) return;
    setState(() => _saving = true);
    try {
      if (_pendingHeroImage != null) {
        final svc = ref.read(uploadServiceProvider);
        final result = await svc.uploadImageFull(
          _pendingHeroImage!,
          folder: 'portfolio/home',
        );
        _heroImageCtrl.text = result.url;
        _pendingHeroImage = null;
      }

      await ref.read(settingsRepositoryProvider).updateHome({
        'heroTitle1Text': _nullIfEmpty(_title1Ctrl.text),
        'heroTitle2Text': _nullIfEmpty(_title2Ctrl.text),
        'ownerNameText': _nullIfEmpty(_ownerNameCtrl.text),
        'heroMainImageUrl': _nullIfEmpty(_heroImageCtrl.text),
        'heroMainImageAlt': _nullIfEmpty(_heroImageAltCtrl.text),
        'ctaText': _nullIfEmpty(_ctaTextCtrl.text),
        'ctaLink': _nullIfEmpty(_ctaLinkCtrl.text),
        'showFeaturedProjects': _showFeatured,
        'featuredTitle': _nullIfEmpty(_featuredTitleCtrl.text),
        'featuredCount': _featuredCount,
      });

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
        // ── Hero texts ───────────────────────────────────────────────
        SettingsFormCard(
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
            const SizedBox(height: AppSpacing.md),
            TextFormField(
              controller: _title2Ctrl,
              decoration: const InputDecoration(
                labelText: 'Segundo título',
                hintText: 'Ej: "Artist"',
                prefixIcon: Icon(Icons.format_size),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            TextFormField(
              controller: _ownerNameCtrl,
              decoration: const InputDecoration(
                labelText: 'Nombre de la artista',
                hintText: 'Ej: "Paola Bolívar Nievas"',
                prefixIcon: Icon(Icons.person_outline),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),

        // ── Hero image ───────────────────────────────────────────────
        SettingsFormCard(
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
          ],
        ),
        const SizedBox(height: AppSpacing.md),

        // ── CTA ──────────────────────────────────────────────────────
        SettingsFormCard(
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
          ],
        ),
        const SizedBox(height: AppSpacing.md),

        // ── Featured projects ─────────────────────────────────────
        SettingsFormCard(
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
        ),
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

  // ── Hero Preview ──────────────────────────────────────────────────────────

  Widget _buildHeroPreview(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final title1 = _title1Ctrl.text.isNotEmpty
        ? _title1Ctrl.text
        : 'Título principal';
    final title2 = _title2Ctrl.text.isNotEmpty ? _title2Ctrl.text : 'Subtítulo';
    final owner = _ownerNameCtrl.text.isNotEmpty
        ? _ownerNameCtrl.text
        : 'Nombre artista';
    final cta = _ctaTextCtrl.text.isNotEmpty
        ? _ctaTextCtrl.text
        : 'Ver proyectos';
    final hasPending = _pendingHeroImage != null;
    final hasUrl = _heroImageCtrl.text.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              Icons.phonelink_outlined,
              size: 16,
              color: colorScheme.primary,
            ),
            const SizedBox(width: 6),
            Text(
              'Vista previa',
              style: Theme.of(context).textTheme.labelMedium?.copyWith(
                color: colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        // Phone frame
        Container(
          decoration: BoxDecoration(
            color: colorScheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: colorScheme.outline.withValues(alpha: 80 / 255),
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 20 / 255),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(22),
            child: AspectRatio(
              aspectRatio: 9 / 16,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Imagen de fondo
                  if (hasPending)
                    Image.file(_pendingHeroImage!, fit: BoxFit.cover)
                  else if (hasUrl)
                    Image.network(
                      _heroImageCtrl.text,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stack) =>
                          PreviewImagePlaceholder(color: colorScheme),
                    )
                  else
                    PreviewImagePlaceholder(color: colorScheme),

                  // Gradiente oscuro en la parte inferior
                  Positioned.fill(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          stops: const [0.35, 1.0],
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 200 / 255),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Texto sobre la imagen
                  Positioned(
                    left: 20,
                    right: 20,
                    bottom: 32,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          title1,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 13,
                            fontWeight: FontWeight.w400,
                            letterSpacing: 1.5,
                          ),
                        ),
                        Text(
                          title2,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            height: 1.1,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          owner,
                          style: const TextStyle(
                            color: Colors.white60,
                            fontSize: 11,
                            fontWeight: FontWeight.w400,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                        const SizedBox(height: 12),
                        // CTA
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 7,
                          ),
                          decoration: BoxDecoration(
                            color: colorScheme.primary,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            cta,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          'Se actualiza en tiempo real mientras editas',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurface.withValues(alpha: 100 / 255),
            fontStyle: FontStyle.italic,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
