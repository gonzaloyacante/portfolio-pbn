import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';
import 'widgets/theme_color_preview.dart';

class SettingsThemePage extends ConsumerStatefulWidget {
  const SettingsThemePage({super.key});

  @override
  ConsumerState<SettingsThemePage> createState() => _SettingsThemePageState();
}

class _SettingsThemePageState extends ConsumerState<SettingsThemePage> {
  bool _saving = false;
  bool _populated = false;

  // ── Light colors ────────────────────────────────────────────────────────
  final _primaryCtrl = TextEditingController();
  final _secondaryCtrl = TextEditingController();
  final _accentCtrl = TextEditingController();
  final _bgCtrl = TextEditingController();
  final _textCtrl = TextEditingController();
  final _cardBgCtrl = TextEditingController();

  // ── Dark colors ─────────────────────────────────────────────────────────
  final _darkPrimaryCtrl = TextEditingController();
  final _darkSecondaryCtrl = TextEditingController();
  final _darkAccentCtrl = TextEditingController();
  final _darkBgCtrl = TextEditingController();
  final _darkTextCtrl = TextEditingController();
  final _darkCardBgCtrl = TextEditingController();

  // ── Fonts ───────────────────────────────────────────────────────────────
  final _headingFontCtrl = TextEditingController();
  final _bodyFontCtrl = TextEditingController();
  final _scriptFontCtrl = TextEditingController();
  final _brandFontCtrl = TextEditingController();
  final _portfolioFontCtrl = TextEditingController();
  final _signatureFontCtrl = TextEditingController();

  // ── Font sizes ──────────────────────────────────────────────────────────
  final _headingFontSizeCtrl = TextEditingController();
  final _bodyFontSizeCtrl = TextEditingController();
  final _scriptFontSizeCtrl = TextEditingController();
  final _brandFontSizeCtrl = TextEditingController();
  final _portfolioFontSizeCtrl = TextEditingController();
  final _signatureFontSizeCtrl = TextEditingController();

  // ── Layout ──────────────────────────────────────────────────────────────
  final _borderRadiusCtrl = TextEditingController();

  /// Controllers that drive the live color preview.
  List<TextEditingController> get _previewControllers => [
    _primaryCtrl,
    _secondaryCtrl,
    _bgCtrl,
    _darkPrimaryCtrl,
    _darkBgCtrl,
  ];

  @override
  void initState() {
    super.initState();
    for (final c in _previewControllers) {
      c.addListener(_refresh);
    }
  }

  void _refresh() => setState(() {});

  @override
  void dispose() {
    for (final c in _previewControllers) {
      c.removeListener(_refresh);
    }
    _primaryCtrl.dispose();
    _secondaryCtrl.dispose();
    _accentCtrl.dispose();
    _bgCtrl.dispose();
    _textCtrl.dispose();
    _cardBgCtrl.dispose();
    _darkPrimaryCtrl.dispose();
    _darkSecondaryCtrl.dispose();
    _darkAccentCtrl.dispose();
    _darkBgCtrl.dispose();
    _darkTextCtrl.dispose();
    _darkCardBgCtrl.dispose();
    _headingFontCtrl.dispose();
    _bodyFontCtrl.dispose();
    _scriptFontCtrl.dispose();
    _brandFontCtrl.dispose();
    _portfolioFontCtrl.dispose();
    _signatureFontCtrl.dispose();
    _headingFontSizeCtrl.dispose();
    _bodyFontSizeCtrl.dispose();
    _scriptFontSizeCtrl.dispose();
    _brandFontSizeCtrl.dispose();
    _portfolioFontSizeCtrl.dispose();
    _signatureFontSizeCtrl.dispose();
    _borderRadiusCtrl.dispose();
    super.dispose();
  }

  void _populate(ThemeSettings s) {
    if (_populated) return;
    _populated = true;
    // Light colors
    _primaryCtrl.text = s.primaryColor;
    _secondaryCtrl.text = s.secondaryColor;
    _accentCtrl.text = s.accentColor;
    _bgCtrl.text = s.backgroundColor;
    _textCtrl.text = s.textColor;
    _cardBgCtrl.text = s.cardBgColor;
    // Dark colors
    _darkPrimaryCtrl.text = s.darkPrimaryColor;
    _darkSecondaryCtrl.text = s.darkSecondaryColor;
    _darkAccentCtrl.text = s.darkAccentColor;
    _darkBgCtrl.text = s.darkBackgroundColor;
    _darkTextCtrl.text = s.darkTextColor;
    _darkCardBgCtrl.text = s.darkCardBgColor;
    // Fonts
    _headingFontCtrl.text = s.headingFont;
    _bodyFontCtrl.text = s.bodyFont;
    _scriptFontCtrl.text = s.scriptFont;
    _brandFontCtrl.text = s.brandFont ?? '';
    _portfolioFontCtrl.text = s.portfolioFont ?? '';
    _signatureFontCtrl.text = s.signatureFont ?? '';
    // Font sizes
    _headingFontSizeCtrl.text = '${s.headingFontSize}';
    _bodyFontSizeCtrl.text = '${s.bodyFontSize}';
    _scriptFontSizeCtrl.text = '${s.scriptFontSize}';
    _brandFontSizeCtrl.text = s.brandFontSize != null
        ? '${s.brandFontSize}'
        : '';
    _portfolioFontSizeCtrl.text = s.portfolioFontSize != null
        ? '${s.portfolioFontSize}'
        : '';
    _signatureFontSizeCtrl.text = s.signatureFontSize != null
        ? '${s.signatureFontSize}'
        : '';
    // Layout
    _borderRadiusCtrl.text = '${s.borderRadius}';
  }

  String? _nullIfEmpty(String v) => v.trim().isEmpty ? null : v.trim();
  int? _intOrNull(String v) => int.tryParse(v.trim());

  Future<void> _save() async {
    if (!_populated) return;
    setState(() => _saving = true);
    try {
      await ref.read(settingsRepositoryProvider).updateTheme({
        // Light colors
        'primaryColor': _primaryCtrl.text.trim(),
        'secondaryColor': _secondaryCtrl.text.trim(),
        'accentColor': _accentCtrl.text.trim(),
        'backgroundColor': _bgCtrl.text.trim(),
        'textColor': _textCtrl.text.trim(),
        'cardBgColor': _cardBgCtrl.text.trim(),
        // Dark colors
        'darkPrimaryColor': _darkPrimaryCtrl.text.trim(),
        'darkSecondaryColor': _darkSecondaryCtrl.text.trim(),
        'darkAccentColor': _darkAccentCtrl.text.trim(),
        'darkBackgroundColor': _darkBgCtrl.text.trim(),
        'darkTextColor': _darkTextCtrl.text.trim(),
        'darkCardBgColor': _darkCardBgCtrl.text.trim(),
        // Fonts
        'headingFont': _headingFontCtrl.text.trim(),
        'bodyFont': _bodyFontCtrl.text.trim(),
        'scriptFont': _scriptFontCtrl.text.trim(),
        'brandFont': _nullIfEmpty(_brandFontCtrl.text),
        'portfolioFont': _nullIfEmpty(_portfolioFontCtrl.text),
        'signatureFont': _nullIfEmpty(_signatureFontCtrl.text),
        // Font sizes
        'headingFontSize': _intOrNull(_headingFontSizeCtrl.text),
        'bodyFontSize': _intOrNull(_bodyFontSizeCtrl.text),
        'scriptFontSize': _intOrNull(_scriptFontSizeCtrl.text),
        'brandFontSize': _intOrNull(_brandFontSizeCtrl.text),
        'portfolioFontSize': _intOrNull(_portfolioFontSizeCtrl.text),
        'signatureFontSize': _intOrNull(_signatureFontSizeCtrl.text),
        // Layout
        'borderRadius': _intOrNull(_borderRadiusCtrl.text),
      });
      ref.invalidate(themeSettingsProvider);
      if (mounted) AppSnackBar.success(context, 'Tema guardado correctamente');
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        AppSnackBar.error(context, 'Error al guardar el tema: $e');
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
          loading: () =>
              const SkeletonSettingsPage(cardCount: 3, fieldsPerCard: 3),
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
              // ── Colores — Modo claro ───────────────────────────────
              SettingsFormCard(
                title: 'Colores — Modo claro',
                children: [
                  ColorField(controller: _primaryCtrl, label: 'Primario'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _secondaryCtrl, label: 'Secundario'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _accentCtrl, label: 'Acento'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _bgCtrl, label: 'Fondo'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _textCtrl, label: 'Texto'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _cardBgCtrl, label: 'Fondo tarjetas'),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Colores — Modo oscuro ──────────────────────────────
              SettingsFormCard(
                title: 'Colores — Modo oscuro',
                children: [
                  ColorField(
                    controller: _darkPrimaryCtrl,
                    label: 'Primario (dark)',
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkSecondaryCtrl,
                    label: 'Secundario (dark)',
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkAccentCtrl,
                    label: 'Acento (dark)',
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _darkBgCtrl, label: 'Fondo (dark)'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _darkTextCtrl, label: 'Texto (dark)'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkCardBgCtrl,
                    label: 'Fondo tarjetas (dark)',
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Tipografías base ───────────────────────────────────
              SettingsFormCard(
                title: 'Tipografías — Base',
                children: [
                  TextFormField(
                    controller: _headingFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente de títulos',
                      prefixIcon: Icon(Icons.title),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _headingFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño títulos (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _bodyFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente de cuerpo',
                      prefixIcon: Icon(Icons.text_fields),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _bodyFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño cuerpo (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _scriptFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente script/decorativa',
                      prefixIcon: Icon(Icons.font_download_outlined),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _scriptFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño script (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Tipografías — Marca ────────────────────────────────
              SettingsFormCard(
                title: 'Tipografías — Marca',
                children: [
                  TextFormField(
                    controller: _brandFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente título "Make-up"',
                      prefixIcon: Icon(Icons.branding_watermark),
                      hintText: 'Ej: Saira Extra Condensed',
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _brandFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _portfolioFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente título "Portfolio"',
                      prefixIcon: Icon(Icons.branding_watermark),
                      hintText: 'Ej: Saira Extra Condensed',
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _portfolioFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _signatureFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente firma',
                      prefixIcon: Icon(Icons.draw_outlined),
                      hintText: 'Ej: Dawning of a New Day',
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _signatureFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Layout ─────────────────────────────────────────────
              SettingsFormCard(
                title: 'Layout',
                children: [
                  TextFormField(
                    controller: _borderRadiusCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Border radius (px)',
                      prefixIcon: Icon(Icons.rounded_corner),
                      hintText: 'Ej: 40',
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Vista previa de colores ────────────────────────────
              ThemeColorPreview(
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
