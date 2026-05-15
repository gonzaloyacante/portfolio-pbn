import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/live_services_page_preview.dart';
import 'widgets/settings_form_card.dart';
import 'widgets/sticky_preview_column.dart';

class SettingsServicesPage extends ConsumerStatefulWidget {
  const SettingsServicesPage({super.key});

  @override
  ConsumerState<SettingsServicesPage> createState() =>
      _SettingsServicesPageState();
}

class _SettingsServicesPageState extends ConsumerState<SettingsServicesPage> {
  bool _saving = false;
  bool _populated = false;
  bool _isDarkPreview = false;

  final _listTitleCtrl = TextEditingController();
  final _listIntroCtrl = TextEditingController();
  final _listTitleFontSizeCtrl = TextEditingController();
  final _listTitleMobileFontSizeCtrl = TextEditingController();
  final _listTitleColorCtrl = TextEditingController();
  final _listTitleColorDarkCtrl = TextEditingController();

  String? _listTitleFont;
  String? _listTitleFontUrl;

  List<TextEditingController> get _controllers => [
    _listTitleCtrl,
    _listIntroCtrl,
    _listTitleFontSizeCtrl,
    _listTitleMobileFontSizeCtrl,
    _listTitleColorCtrl,
    _listTitleColorDarkCtrl,
  ];

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }

  void _populate(ServicesPageSettings settings) {
    if (_populated) return;
    _populated = true;
    _listTitleCtrl.text = settings.listTitle ?? '';
    _listIntroCtrl.text = settings.listIntro ?? '';
    _listTitleFont = settings.listTitleFont;
    _listTitleFontUrl = settings.listTitleFontUrl;
    _listTitleFontSizeCtrl.text = settings.listTitleFontSize?.toString() ?? '';
    _listTitleMobileFontSizeCtrl.text =
        settings.listTitleMobileFontSize?.toString() ?? '';
    _listTitleColorCtrl.text = settings.listTitleColor ?? '';
    _listTitleColorDarkCtrl.text = settings.listTitleColorDark ?? '';
  }

  String? _nullIfEmpty(String value) {
    final trimmed = value.trim();
    return trimmed.isEmpty ? null : trimmed;
  }

  int? _nullableInt(TextEditingController controller) {
    final trimmed = controller.text.trim();
    return trimmed.isEmpty ? null : int.tryParse(trimmed);
  }

  Future<void> _save() async {
    final desktopSize = _nullableInt(_listTitleFontSizeCtrl);
    final mobileSize = _nullableInt(_listTitleMobileFontSizeCtrl);
    if ((desktopSize != null && (desktopSize < 12 || desktopSize > 160)) ||
        (mobileSize != null && (mobileSize < 12 || mobileSize > 160))) {
      AppSnackBar.error(
        context,
        'Los tamaños del título deben estar entre 12 y 160 px.',
      );
      return;
    }

    setState(() => _saving = true);
    try {
      await ref.read(settingsRepositoryProvider).updateServicesPageSettings({
        'listTitle': _nullIfEmpty(_listTitleCtrl.text),
        'listIntro': _nullIfEmpty(_listIntroCtrl.text),
        'listTitleFont': _listTitleFont?.trim().isEmpty ?? true
            ? null
            : _listTitleFont,
        'listTitleFontUrl': _listTitleFontUrl?.trim().isEmpty ?? true
            ? null
            : _listTitleFontUrl,
        'listTitleFontSize': desktopSize,
        'listTitleMobileFontSize': mobileSize,
        'listTitleColor': _nullIfEmpty(_listTitleColorCtrl.text),
        'listTitleColorDark': _nullIfEmpty(_listTitleColorDarkCtrl.text),
      });
      ref.invalidate(servicesPageSettingsProvider);
      if (mounted) {
        AppSnackBar.success(
          context,
          'Configuración de la página de servicios guardada.',
        );
      }
    } catch (error, stackTrace) {
      Sentry.captureException(error, stackTrace: stackTrace);
      if (mounted) {
        AppSnackBar.error(context, 'No se pudo guardar. Inténtalo de nuevo.');
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Widget _buildPreview() {
    return LiveServicesPagePreview(
      listTitle: _listTitleCtrl.text,
      listIntro: _listIntroCtrl.text,
      listTitleFont: _listTitleFont,
      listTitleFontSize: int.tryParse(_listTitleFontSizeCtrl.text) ?? 32,
      listTitleMobileFontSize:
          int.tryParse(_listTitleMobileFontSizeCtrl.text) ?? 18,
      listTitleColorHex: _nullIfEmpty(_listTitleColorCtrl.text),
      listTitleColorDarkHex: _nullIfEmpty(_listTitleColorDarkCtrl.text),
      isDarkMode: _isDarkPreview,
      onToggleDark: (value) => setState(() => _isDarkPreview = value),
    );
  }

  Widget _buildCompactPreview() {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Theme.of(
            context,
          ).colorScheme.outlineVariant.withValues(alpha: 80 / 255),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: _buildPreview(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final horizontalPadding = AppBreakpoints.pageMargin(context);
    final isExpanded = AppBreakpoints.isExpanded(context);
    final asyncSettings = ref.watch(servicesPageSettingsProvider);

    return AppScaffold(
      title: 'Página de Servicios',
      body: LoadingOverlay(
        isLoading: _saving,
        child: asyncSettings.when(
          loading: () =>
              const SkeletonSettingsPage(cardCount: 2, fieldsPerCard: 3),
          error: (error, _) => ErrorState.forFailure(
            error,
            onRetry: () => ref.invalidate(servicesPageSettingsProvider),
          ),
          data: (settings) {
            _populate(settings);

            final form = ListView(
              padding: EdgeInsets.all(horizontalPadding),
              children: [
                if (!isExpanded) ...[
                  _buildCompactPreview(),
                  const SizedBox(height: AppSpacing.md),
                ],
                SettingsFormCard(
                  title: 'Cabecera pública',
                  leadingIcon: Icons.web_asset_outlined,
                  children: [
                    TextFormField(
                      controller: _listTitleCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Título',
                        hintText: 'Mis Servicios',
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    TextFormField(
                      controller: _listIntroCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Introducción',
                        hintText:
                            'Servicios pensados para novias, editorial y caracterización.',
                      ),
                      maxLines: 3,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                SettingsFormCard(
                  title: 'Tipografía y color del título',
                  leadingIcon: Icons.text_fields_outlined,
                  children: [
                    FontPickerField(
                      value: _listTitleFont,
                      label: 'Fuente del título',
                      onChanged: (name, url) => setState(() {
                        _listTitleFont = name;
                        _listTitleFontUrl = url;
                      }),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _listTitleFontSizeCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(
                              labelText: 'Tamaño escritorio (px)',
                              hintText: '32',
                            ),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        Expanded(
                          child: TextFormField(
                            controller: _listTitleMobileFontSizeCtrl,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(
                              labelText: 'Tamaño móvil (px)',
                              hintText: '18',
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    ColorField(
                      controller: _listTitleColorCtrl,
                      label: 'Color del título (modo claro)',
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    ColorField(
                      controller: _listTitleColorDarkCtrl,
                      label: 'Color del título (modo oscuro)',
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
                  label: Text(_saving ? 'Guardando…' : 'Guardar cambios'),
                ),
              ],
            );

            if (!isExpanded) return form;

            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(flex: 55, child: form),
                Expanded(
                  flex: 45,
                  child: Padding(
                    padding: EdgeInsets.only(
                      right: horizontalPadding,
                      top: horizontalPadding,
                    ),
                    child: StickyPreviewColumn(preview: _buildPreview()),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
