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
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/app_snack_bar.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';

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
  void dispose() {
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
    final picker = ImagePicker();
    final primaryColor = Theme.of(context).colorScheme.primary;
    final picked = await picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 85,
    );
    if (picked == null) return;

    final cropped = await ImageCropper().cropImage(
      sourcePath: picked.path,
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
        _heroImageCtrl.text = await svc.uploadImage(
          _pendingHeroImage!,
          folder: 'portfolio/home',
        );
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
          loading: _buildShimmer,
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

  Widget _buildShimmer() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.base),
      children: List.generate(
        4,
        (_) => Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.md),
          child: ShimmerLoader(
            child: ShimmerBox(
              width: double.infinity,
              height: 80,
              borderRadius: 20,
            ),
          ),
        ),
      ),
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  Widget _buildForm(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    final maxWidth = AppBreakpoints.value<double>(
      context,
      compact: double.infinity,
      medium: 760,
      expanded: 960,
    );

    return SingleChildScrollView(
      padding: padding,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: Column(
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
                  _HeroImagePicker(
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
                    _FeaturedCountPicker(
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
          ),
        ),
      ),
    );
  }
}

// ── Image Picker Widget ───────────────────────────────────────────────────────

class _HeroImagePicker extends StatelessWidget {
  const _HeroImagePicker({
    required this.imageUrl,
    required this.pendingFile,
    required this.onPick,
    required this.onRemove,
  });

  final String imageUrl;
  final File? pendingFile;
  final VoidCallback onPick;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final hasImage = pendingFile != null || imageUrl.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Preview
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          height: hasImage ? 180 : 100,
          decoration: BoxDecoration(
            color: colorScheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: colorScheme.outline.withValues(alpha: 0.4),
            ),
          ),
          clipBehavior: Clip.antiAlias,
          child: hasImage
              ? Stack(
                  fit: StackFit.expand,
                  children: [
                    pendingFile != null
                        ? Image.file(pendingFile!, fit: BoxFit.cover)
                        : Image.network(
                            imageUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (_, error, stack) => const Center(
                              child: Icon(
                                Icons.broken_image_outlined,
                                size: 40,
                              ),
                            ),
                          ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: GestureDetector(
                        onTap: onRemove,
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: Colors.black54,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.close_rounded,
                            size: 16,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                )
              : Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.image_outlined,
                        size: 32,
                        color: colorScheme.outline,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Sin imagen',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
        ),
        const SizedBox(height: AppSpacing.sm),

        // Action button
        OutlinedButton.icon(
          onPressed: onPick,
          icon: const Icon(Icons.photo_library_outlined, size: 18),
          label: Text(hasImage ? 'Cambiar imagen' : 'Elegir foto'),
        ),
      ],
    );
  }
}

// ── Featured Count Picker ─────────────────────────────────────────────────────

class _FeaturedCountPicker extends StatelessWidget {
  const _FeaturedCountPicker({required this.value, required this.onChanged});

  final int value;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Cantidad de proyectos a mostrar',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: AppSpacing.sm),
        Row(
          children: List.generate(9, (i) {
            final n = i + 1;
            final selected = value == n;
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 2),
                child: GestureDetector(
                  onTap: () => onChanged(n),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    height: 36,
                    decoration: BoxDecoration(
                      color: selected
                          ? colorScheme.primary
                          : colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: selected
                            ? colorScheme.primary
                            : colorScheme.outline.withValues(alpha: 0.3),
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      '$n',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: selected ? Colors.white : colorScheme.onSurface,
                      ),
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      ],
    );
  }
}
