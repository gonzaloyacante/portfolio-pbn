import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';

class SettingsCategoryPage extends ConsumerStatefulWidget {
  const SettingsCategoryPage({super.key});

  @override
  ConsumerState<SettingsCategoryPage> createState() =>
      _SettingsCategoryPageState();
}

class _SettingsCategoryPageState extends ConsumerState<SettingsCategoryPage> {
  bool _saving = false;
  bool _populated = false;

  final _gridColumnsCtrl = TextEditingController();
  bool _showDescription = true;

  @override
  void dispose() {
    _gridColumnsCtrl.dispose();
    super.dispose();
  }

  void _populate(CategoryDisplaySettings s) {
    if (_populated) return;
    _populated = true;
    _gridColumnsCtrl.text = s.gridColumns.toString();
    _showDescription = s.showDescription;
  }

  Future<void> _save() async {
    final gridColumns = int.tryParse(_gridColumnsCtrl.text) ?? 4;
    if (gridColumns < 1 || gridColumns > 5) {
      AppSnackBar.error(
        context,
        'Las columnas del grid deben estar entre 1 y 5.',
      );
      return;
    }

    setState(() => _saving = true);
    try {
      final repo = ref.read(settingsRepositoryProvider);
      await repo.updateCategorySettings({
        'showDescription': _showDescription,
        'gridColumns': gridColumns,
      });
      ref.invalidate(categoryDisplaySettingsProvider);
      if (mounted) {
        AppSnackBar.success(context, 'Configuración de categorías guardada.');
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
    final async = ref.watch(categoryDisplaySettingsProvider);

    return AppScaffold(
      title: 'Categorías',
      body: LoadingOverlay(
        isLoading: _saving,
        child: async.when(
          loading: () =>
              const SkeletonSettingsPage(cardCount: 1, fieldsPerCard: 2),
          error: (e, _) => ErrorState.forFailure(
            e,
            onRetry: () => ref.invalidate(categoryDisplaySettingsProvider),
          ),
          data: (s) {
            _populate(s);
            return ListView(
              padding: EdgeInsets.all(hPad),
              children: [
                SettingsFormCard(
                  title: 'Visualización',
                  leadingIcon: Icons.grid_view_outlined,
                  children: [
                    SwitchListTile(
                      title: const Text('Mostrar descripción'),
                      value: _showDescription,
                      onChanged: (v) => setState(() => _showDescription = v),
                      dense: true,
                    ),
                    TextFormField(
                      controller: _gridColumnsCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Columnas en el grid',
                        hintText: '4',
                        helperText: '1 a 5',
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
