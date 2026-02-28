import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
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
  void dispose() {
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
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Tema guardado')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'No fue posible completar la accion. Intentalo de nuevo.',
            ),
          ),
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
