import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_snack_bar.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/color_field.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';

class SettingsThemePage extends ConsumerStatefulWidget {
  const SettingsThemePage({super.key});

  @override
  ConsumerState<SettingsThemePage> createState() => _SettingsThemePageState();
}

class _SettingsThemePageState extends ConsumerState<SettingsThemePage> {
  bool _saving = false;
  bool _populated = false;

  // Light colors
  final _primaryCtrl = TextEditingController();
  final _secondaryCtrl = TextEditingController();
  final _bgCtrl = TextEditingController();

  // Dark colors
  final _darkPrimaryCtrl = TextEditingController();
  final _darkBgCtrl = TextEditingController();

  // Fonts
  final _headingFontCtrl = TextEditingController();
  final _bodyFontCtrl = TextEditingController();
  final _scriptFontCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    for (final c in [
      _primaryCtrl,
      _secondaryCtrl,
      _bgCtrl,
      _darkPrimaryCtrl,
      _darkBgCtrl,
    ]) {
      c.addListener(_refresh);
    }
  }

  void _refresh() => setState(() {});

  @override
  void dispose() {
    for (final c in [
      _primaryCtrl,
      _secondaryCtrl,
      _bgCtrl,
      _darkPrimaryCtrl,
      _darkBgCtrl,
    ]) {
      c.removeListener(_refresh);
    }
    _primaryCtrl.dispose();
    _secondaryCtrl.dispose();
    _bgCtrl.dispose();
    _darkPrimaryCtrl.dispose();
    _darkBgCtrl.dispose();
    _headingFontCtrl.dispose();
    _bodyFontCtrl.dispose();
    _scriptFontCtrl.dispose();
    super.dispose();
  }

  void _populate(ThemeSettings s) {
    if (_populated) return;
    _populated = true;
    _primaryCtrl.text = s.primaryColor;
    _secondaryCtrl.text = s.secondaryColor;
    _bgCtrl.text = s.backgroundColor;
    _darkPrimaryCtrl.text = s.darkPrimaryColor;
    _darkBgCtrl.text = s.darkBackgroundColor;
    _headingFontCtrl.text = s.headingFont;
    _bodyFontCtrl.text = s.bodyFont;
    _scriptFontCtrl.text = s.scriptFont;
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await ref.read(settingsRepositoryProvider).updateTheme({
        'primaryColor': _primaryCtrl.text.trim(),
        'secondaryColor': _secondaryCtrl.text.trim(),
        'backgroundColor': _bgCtrl.text.trim(),
        'darkPrimaryColor': _darkPrimaryCtrl.text.trim(),
        'darkBackgroundColor': _darkBgCtrl.text.trim(),
        'headingFont': _headingFontCtrl.text.trim(),
        'bodyFont': _bodyFontCtrl.text.trim(),
        'scriptFont': _scriptFontCtrl.text.trim(),
      });
      ref.invalidate(themeSettingsProvider);
      if (mounted) AppSnackBar.success(context, 'Tema guardado correctamente');
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        AppSnackBar.error(
          context,
          'No se pudo guardar el tema. Inténtalo de nuevo.',
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(themeSettingsProvider);

    return AppScaffold(
      title: 'Tema',
      actions: [
        IconButton(
          icon: const Icon(Icons.save_outlined),
          tooltip: 'Guardar',
          onPressed: _save,
        ),
      ],
      body: LoadingOverlay(
        isLoading: _saving,
        child: async.when(
          loading: () => _buildShimmer(),
          error: (e, _) => ErrorState(
            message: e.toString(),
            onRetry: () => ref.invalidate(themeSettingsProvider),
          ),
          data: (settings) {
            _populate(settings);
            return _buildForm(context);
          },
        ),
      ),
    );
  }

  Widget _buildShimmer() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.base),
      children: List.generate(
        4,
        (_) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: ShimmerLoader(
            child: ShimmerBox(
              width: double.infinity,
              height: 56,
              borderRadius: 12,
            ),
          ),
        ),
      ),
    );
  }

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
              SettingsFormCard(
                title: 'Colores — Modo claro',
                children: [
                  ColorField(controller: _primaryCtrl, label: 'Color primario'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _secondaryCtrl,
                    label: 'Color secundario',
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _bgCtrl, label: 'Fondo'),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              SettingsFormCard(
                title: 'Colores — Modo oscuro',
                children: [
                  ColorField(
                    controller: _darkPrimaryCtrl,
                    label: 'Color primario (dark)',
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _darkBgCtrl, label: 'Fondo (dark)'),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              SettingsFormCard(
                title: 'Tipografías',
                children: [
                  TextFormField(
                    controller: _headingFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente de títulos',
                      prefixIcon: Icon(Icons.title),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _bodyFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente de cuerpo',
                      prefixIcon: Icon(Icons.text_fields),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _scriptFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente script/decorativa',
                      prefixIcon: Icon(Icons.font_download_outlined),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              // ── Vista previa de colores ──────────────────────────────
              _ThemeColorPreview(
                lightPrimary: _primaryCtrl.text,
                lightSecondary: _secondaryCtrl.text,
                lightBg: _bgCtrl.text,
                darkPrimary: _darkPrimaryCtrl.text,
                darkBg: _darkBgCtrl.text,
              ),
              const SizedBox(height: AppSpacing.xl),
              FilledButton.icon(
                onPressed: _save,
                icon: const Icon(Icons.save_outlined),
                label: const Text('Guardar tema'),
              ),
              const SizedBox(height: AppSpacing.base),
            ],
          ),
        ),
      ),
    );
  }
}

// ── _ThemeColorPreview ────────────────────────────────────────────────────────

/// Muestra una vista previa visual de los colores del tema en tiempo real.
class _ThemeColorPreview extends StatelessWidget {
  const _ThemeColorPreview({
    required this.lightPrimary,
    required this.lightSecondary,
    required this.lightBg,
    required this.darkPrimary,
    required this.darkBg,
  });

  final String lightPrimary;
  final String lightSecondary;
  final String lightBg;
  final String darkPrimary;
  final String darkBg;

  Color? _parse(String hex) {
    try {
      final h = hex.trim().replaceAll('#', '');
      if (h.length < 6) return null;
      return Color(int.parse('FF${h.substring(0, 6)}', radix: 16));
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    final lPrimary = _parse(lightPrimary) ?? colorScheme.primary;
    final lSecondary = _parse(lightSecondary) ?? colorScheme.secondary;
    final lBg = _parse(lightBg) ?? colorScheme.surface;
    final dPrimary = _parse(darkPrimary) ?? colorScheme.primary;
    final dBg = _parse(darkBg) ?? const Color(0xFF0F0505);

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colorScheme.outlineVariant.withAlpha(80)),
      ),
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.palette_outlined, size: 16, color: colorScheme.primary),
              const SizedBox(width: 6),
              Text(
                'Vista previa del tema',
                style: textTheme.labelMedium?.copyWith(
                  color: colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: _MiniThemeCard(
                  label: 'Modo claro',
                  primary: lPrimary,
                  secondary: lSecondary,
                  background: lBg,
                  isDark: false,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: _MiniThemeCard(
                  label: 'Modo oscuro',
                  primary: dPrimary,
                  secondary: lSecondary,
                  background: dBg,
                  isDark: true,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniThemeCard extends StatelessWidget {
  const _MiniThemeCard({
    required this.label,
    required this.primary,
    required this.secondary,
    required this.background,
    required this.isDark,
  });

  final String label;
  final Color primary;
  final Color secondary;
  final Color background;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    final textColor = isDark ? Colors.white : Colors.black87;
    final subtextColor = isDark ? Colors.white54 : Colors.black45;

    return Container(
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(isDark ? 60 : 18),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(AppSpacing.sm),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 9,
              color: subtextColor,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          // Mini card dentro del preview
          Container(
            decoration: BoxDecoration(
              color: isDark
                  ? Colors.white.withAlpha(12)
                  : Colors.white.withAlpha(230),
              borderRadius: BorderRadius.circular(8),
            ),
            padding: const EdgeInsets.all(6),
            child: Row(
              children: [
                Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    color: primary.withAlpha(isDark ? 90 : 40),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Icon(Icons.photo_outlined,
                      size: 12, color: primary),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        height: 5,
                        decoration: BoxDecoration(
                          color: textColor.withAlpha(180),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 3),
                      Container(
                        height: 4,
                        width: 40,
                        decoration: BoxDecoration(
                          color: subtextColor,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          // Color swatches
          Row(
            children: [
              _Swatch(color: primary),
              const SizedBox(width: 4),
              _Swatch(color: secondary),
              const SizedBox(width: 4),
              _SwatchOutlined(color: background),
            ],
          ),
        ],
      ),
    );
  }
}

class _Swatch extends StatelessWidget {
  const _Swatch({required this.color});
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 14,
      height: 14,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(
          color: Colors.black.withAlpha(30),
          width: 0.5,
        ),
      ),
    );
  }
}

class _SwatchOutlined extends StatelessWidget {
  const _SwatchOutlined({required this.color});
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 14,
      height: 14,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(
          color: Colors.grey.withAlpha(100),
          width: 1,
        ),
      ),
    );
  }
}
