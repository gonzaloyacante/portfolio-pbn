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

part 'settings_contact_page_builders.dart';

class SettingsContactPage extends ConsumerStatefulWidget {
  const SettingsContactPage({super.key});

  @override
  ConsumerState<SettingsContactPage> createState() =>
      _SettingsContactPageState();
}

class _SettingsContactPageState extends ConsumerState<SettingsContactPage> {
  bool _saving = false;
  bool _populated = false;
  bool _isDirty = false;

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
  void initState() {
    super.initState();
    for (final c in [
      _pageTitleCtrl,
      _ownerNameCtrl,
      _emailCtrl,
      _phoneCtrl,
      _whatsappCtrl,
      _locationCtrl,
    ]) {
      c.addListener(_markDirty);
    }
  }

  void _markDirty() {
    if (!_isDirty) setState(() => _isDirty = true);
  }

  Future<void> _maybeLeave(BuildContext context) async {
    if (!_isDirty) {
      context.pop();
      return;
    }
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => const ConfirmDialog(
        title: '¿Salir sin guardar?',
        message: 'Tienes cambios sin guardar.',
        confirmLabel: 'Salir',
        cancelLabel: 'Continuar editando',
      ),
    );
    if (confirmed == true && context.mounted) context.pop();
  }

  @override
  void dispose() {
    for (final c in [
      _pageTitleCtrl,
      _ownerNameCtrl,
      _emailCtrl,
      _phoneCtrl,
      _whatsappCtrl,
      _locationCtrl,
    ]) {
      c.removeListener(_markDirty);
    }
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
      if (mounted) {
        setState(() => _isDirty = false);
        AppSnackBar.success(context, 'Configuración guardada');
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        AppSnackBar.error(context, 'Error al guardar: $e');
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(contactSettingsProvider);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) =>
          _maybeLeave(context),
      child: AppScaffold(
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
      ),
    );
  }
}
