import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';

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
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Tema guardado')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('No fue posible completar la accion. Intentalo de nuevo.')));
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
      actions: [IconButton(icon: const Icon(Icons.save_outlined), tooltip: 'Guardar', onPressed: _save)],
      body: LoadingOverlay(
        isLoading: _saving,
        child: async.when(
          loading: () => _buildShimmer(),
          error: (e, _) => ErrorState(message: e.toString(), onRetry: () => ref.invalidate(themeSettingsProvider)),
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
      padding: const EdgeInsets.all(16),
      children: List.generate(
        4,
        (_) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: ShimmerLoader(child: ShimmerBox(width: double.infinity, height: 56, borderRadius: 12)),
        ),
      ),
    );
  }

  Widget _buildForm(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _ColorCard(
            context: context,
            title: 'Colores — Modo claro',
            fields: [
              _ColorField(controller: _primaryCtrl, label: 'Color primario'),
              _ColorField(controller: _secondaryCtrl, label: 'Color secundario'),
              _ColorField(controller: _bgCtrl, label: 'Fondo'),
            ],
          ),
          const SizedBox(height: 12),
          _ColorCard(
            context: context,
            title: 'Colores — Modo oscuro',
            fields: [
              _ColorField(controller: _darkPrimaryCtrl, label: 'Color primario (dark)'),
              _ColorField(controller: _darkBgCtrl, label: 'Fondo (dark)'),
            ],
          ),
          const SizedBox(height: 12),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Tipografías',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _headingFontCtrl,
                    decoration: const InputDecoration(labelText: 'Fuente de títulos', prefixIcon: Icon(Icons.title)),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _bodyFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente de cuerpo',
                      prefixIcon: Icon(Icons.text_fields),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _scriptFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente script/decorativa',
                      prefixIcon: Icon(Icons.font_download_outlined),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          FilledButton.icon(onPressed: _save, icon: const Icon(Icons.save_outlined), label: const Text('Guardar tema')),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

// ── Auxiliares ────────────────────────────────────────────────────────────────

class _ColorCard extends StatelessWidget {
  const _ColorCard({required this.context, required this.title, required this.fields});
  final BuildContext context;
  final String title;
  final List<Widget> fields;

  @override
  Widget build(BuildContext _) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ...fields.expand((f) => [f, const SizedBox(height: 12)]).toList()..removeLast(),
          ],
        ),
      ),
    );
  }
}

class _ColorField extends StatelessWidget {
  const _ColorField({required this.controller, required this.label});
  final TextEditingController controller;
  final String label;

  Color? _parseColor(String hex) {
    try {
      final h = hex.replaceAll('#', '');
      return Color(int.parse('FF$h', radix: 16));
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: controller,
      builder: (_, value, _) {
        final color = _parseColor(value.text);
        return TextFormField(
          controller: controller,
          decoration: InputDecoration(
            labelText: label,
            hintText: '#6c0a0a',
            prefixIcon: color != null
                ? Padding(
                    padding: const EdgeInsets.all(12),
                    child: Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                        border: Border.all(color: Theme.of(context).colorScheme.outline, width: 0.5),
                      ),
                    ),
                  )
                : const Icon(Icons.circle_outlined),
          ),
        );
      },
    );
  }
}
