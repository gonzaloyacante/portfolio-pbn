import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';

class SettingsTestimonialPage extends ConsumerStatefulWidget {
  const SettingsTestimonialPage({super.key});

  @override
  ConsumerState<SettingsTestimonialPage> createState() =>
      _SettingsTestimonialPageState();
}

class _SettingsTestimonialPageState
    extends ConsumerState<SettingsTestimonialPage> {
  bool _saving = false;
  bool _populated = false;

  final _titleCtrl = TextEditingController();
  final _maxDisplayCtrl = TextEditingController();
  final _autoAdvanceCtrl = TextEditingController();
  bool _showOnAbout = true;
  bool _showOnAll = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _maxDisplayCtrl.dispose();
    _autoAdvanceCtrl.dispose();
    super.dispose();
  }

  void _populate(TestimonialSettings s) {
    if (_populated) return;
    _populated = true;
    _titleCtrl.text = s.title ?? '';
    _maxDisplayCtrl.text = s.maxDisplay.toString();
    _autoAdvanceCtrl.text = s.sliderAutoAdvanceMs.toString();
    _showOnAbout = s.showOnAbout;
    _showOnAll = s.showOnAll;
  }

  Future<void> _save() async {
    final maxDisplay = int.tryParse(_maxDisplayCtrl.text) ?? 6;
    final autoAdvance = int.tryParse(_autoAdvanceCtrl.text) ?? 5000;

    if (maxDisplay < 1 || maxDisplay > 20) {
      AppSnackBar.error(
        context,
        'El máximo de testimonios debe estar entre 1 y 20.',
      );
      return;
    }

    if (autoAdvance < 1000 || autoAdvance > 30000) {
      AppSnackBar.error(
        context,
        'El auto-avance debe estar entre 1000 y 30000 ms.',
      );
      return;
    }

    setState(() => _saving = true);
    try {
      final repo = ref.read(settingsRepositoryProvider);
      await repo.updateTestimonialSettings({
        if (_titleCtrl.text.isNotEmpty) 'title': _titleCtrl.text,
        'showOnAbout': _showOnAbout,
        'showOnAll': _showOnAll,
        'maxDisplay': maxDisplay,
        'sliderAutoAdvanceMs': autoAdvance,
      });
      ref.invalidate(testimonialSettingsProvider);
      if (mounted) {
        AppSnackBar.success(context, 'Configuración de testimonios guardada.');
      }
    } catch (_) {
      if (mounted) {
        AppSnackBar.error(context, 'No se pudo guardar. Inténtalo de nuevo.');
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    final async = ref.watch(testimonialSettingsProvider);

    return AppScaffold(
      title: 'Testimonios',
      body: LoadingOverlay(
        isLoading: _saving,
        child: async.when(
          loading: () =>
              const SkeletonSettingsPage(cardCount: 3, fieldsPerCard: 2),
          error: (e, _) => ErrorState.forFailure(
            e,
            onRetry: () => ref.invalidate(testimonialSettingsProvider),
          ),
          data: (s) {
            _populate(s);
            return ListView(
              padding: EdgeInsets.all(hPad),
              children: [
                SettingsFormCard(
                  title: 'Visualización',
                  leadingIcon: Icons.visibility_outlined,
                  children: [
                    SwitchListTile(
                      title: const Text('Mostrar en Sobre mí'),
                      value: _showOnAbout,
                      onChanged: (v) => setState(() => _showOnAbout = v),
                      dense: true,
                    ),
                    SwitchListTile(
                      title: const Text('Mostrar en todas las páginas'),
                      subtitle: const Text(
                        'También aparecen al final de cada página pública',
                      ),
                      value: _showOnAll,
                      onChanged: (v) => setState(() => _showOnAll = v),
                      dense: true,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                SettingsFormCard(
                  title: 'Contenido',
                  leadingIcon: Icons.text_fields_outlined,
                  children: [
                    TextFormField(
                      controller: _titleCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Título de la sección',
                        hintText: 'Lo que dicen mis clientes',
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    TextFormField(
                      controller: _maxDisplayCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Máximo de testimonios',
                        hintText: '6',
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                SettingsFormCard(
                  title: 'Velocidad del slider',
                  leadingIcon: Icons.timer_outlined,
                  children: [
                    TextFormField(
                      controller: _autoAdvanceCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Auto-avance (ms)',
                        hintText: '5000',
                        helperText: '1000–30000 ms. 5000 = 5 segundos',
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),
                FilledButton.icon(
                  onPressed: _saving ? null : _save,
                  icon: _saving
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.save_outlined),
                  label: Text(_saving ? 'Guardando…' : 'Guardar'),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
