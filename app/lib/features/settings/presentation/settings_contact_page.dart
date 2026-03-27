import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';
import '../../../core/theme/app_radius.dart';

class SettingsContactPage extends ConsumerStatefulWidget {
  const SettingsContactPage({super.key});

  @override
  ConsumerState<SettingsContactPage> createState() =>
      _SettingsContactPageState();
}

class _SettingsContactPageState extends ConsumerState<SettingsContactPage> {
  bool _saving = false;
  bool _populated = false;

  final _pageTitleCtrl = TextEditingController();
  final _ownerNameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _whatsappCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  bool _showSocialLinks = true;
  bool _showPhone = true;
  bool _showWhatsapp = true;
  bool _showEmail = true;
  bool _showLocation = true;

  @override
  void dispose() {
    _pageTitleCtrl.dispose();
    _ownerNameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _whatsappCtrl.dispose();
    _locationCtrl.dispose();
    super.dispose();
  }

  void _populate(ContactSettings s) {
    if (_populated) return;
    _populated = true;
    _pageTitleCtrl.text = s.pageTitle ?? '';
    _ownerNameCtrl.text = s.ownerName ?? '';
    _emailCtrl.text = s.email ?? '';
    _phoneCtrl.text = s.phone ?? '';
    _whatsappCtrl.text = s.whatsapp ?? '';
    _locationCtrl.text = s.location ?? '';
    _showSocialLinks = s.showSocialLinks;
    _showPhone = s.showPhone;
    _showWhatsapp = s.showWhatsapp;
    _showEmail = s.showEmail;
    _showLocation = s.showLocation;
  }

  String? _nullIfEmpty(String v) => v.trim().isEmpty ? null : v.trim();

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await ref.read(settingsRepositoryProvider).updateContact({
        'pageTitle': _nullIfEmpty(_pageTitleCtrl.text),
        'ownerName': _nullIfEmpty(_ownerNameCtrl.text),
        'email': _nullIfEmpty(_emailCtrl.text),
        'phone': _nullIfEmpty(_phoneCtrl.text),
        'whatsapp': _nullIfEmpty(_whatsappCtrl.text),
        'location': _nullIfEmpty(_locationCtrl.text),
        'showSocialLinks': _showSocialLinks,
        'showPhone': _showPhone,
        'showWhatsapp': _showWhatsapp,
        'showEmail': _showEmail,
        'showLocation': _showLocation,
      });
      ref.invalidate(contactSettingsProvider);
      if (mounted) AppSnackBar.success(context, 'Configuración guardada');
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        AppSnackBar.error(context, 'No se pudo guardar. Inténtalo de nuevo.');
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(contactSettingsProvider);

    return AppScaffold(
      title: 'Contacto',
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
              const SkeletonSettingsPage(cardCount: 2, fieldsPerCard: 3),
          error: (e, _) => ErrorState(
            message: e.toString(),
            onRetry: () => ref.invalidate(contactSettingsProvider),
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
              SettingsFormCard(
                title: 'Página de contacto',
                children: [
                  TextFormField(
                    controller: _pageTitleCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Título de página',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _ownerNameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Nombre del propietario',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              SettingsFormCard(
                title: 'Datos de contacto',
                children: [
                  TextFormField(
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      prefixIcon: Icon(Icons.email_outlined),
                    ),
                  ),
                  const SizedBox(height: 12),
                  PhoneInputField(controller: _phoneCtrl, label: 'Teléfono'),
                  const SizedBox(height: 12),
                  PhoneInputField(controller: _whatsappCtrl, label: 'WhatsApp'),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _locationCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Ubicación',
                      prefixIcon: Icon(Icons.location_on_outlined),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              AppCard(
                borderRadius: AppRadius.forCard,
                child: Column(
                  children: [
                    SwitchListTile(
                      title: const Text('Mostrar email'),
                      subtitle: const Text('Visible en la página de contacto'),
                      value: _showEmail,
                      onChanged: (v) => setState(() => _showEmail = v),
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20),
                        ),
                      ),
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      title: const Text('Mostrar teléfono'),
                      subtitle: const Text('Visible en la página de contacto'),
                      value: _showPhone,
                      onChanged: (v) => setState(() => _showPhone = v),
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      title: const Text('Mostrar WhatsApp'),
                      subtitle: const Text('Visible en la página de contacto'),
                      value: _showWhatsapp,
                      onChanged: (v) => setState(() => _showWhatsapp = v),
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      title: const Text('Mostrar ubicación'),
                      subtitle: const Text('Visible en la página de contacto'),
                      value: _showLocation,
                      onChanged: (v) => setState(() => _showLocation = v),
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(20),
                          bottomRight: Radius.circular(20),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              AppCard(
                borderRadius: AppRadius.forCard,
                child: Column(
                  children: [
                    SwitchListTile(
                      title: const Text('Mostrar redes sociales'),
                      subtitle: const Text(
                        'Muestra iconos de redes en la página de contacto',
                      ),
                      value: _showSocialLinks,
                      onChanged: (v) => setState(() => _showSocialLinks = v),
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20),
                        ),
                      ),
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.share_outlined, size: 20),
                      title: const Text('Administrar redes sociales'),
                      subtitle: const Text(
                        'Activar o desactivar cada red individualmente',
                      ),
                      trailing: const Icon(
                        Icons.chevron_right_rounded,
                        size: 20,
                      ),
                      onTap: () => context.pushNamed(RouteNames.settingsSocial),
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(20),
                          bottomRight: Radius.circular(20),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
              FilledButton.icon(
                onPressed: _save,
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
