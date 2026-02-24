import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';

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
      });
      ref.invalidate(contactSettingsProvider);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Configuración guardada')));
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
    final async = ref.watch(contactSettingsProvider);

    return LoadingOverlay(
      isLoading: _saving,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
            tooltip: 'Volver',
          ),
          title: const Text('Contacto'),
          centerTitle: false,
          actions: [
            IconButton(
              icon: const Icon(Icons.save_outlined),
              tooltip: 'Guardar',
              onPressed: _save,
            ),
          ],
        ),
        body: async.when(
          loading: () => _buildShimmer(),
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

  Widget _buildShimmer() {
    return ListView(
      padding: const EdgeInsets.all(16),
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
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _card(
            context,
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
          const SizedBox(height: 12),
          _card(
            context,
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
              TextFormField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Teléfono',
                  prefixIcon: Icon(Icons.phone_outlined),
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _whatsappCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'WhatsApp',
                  prefixIcon: Icon(Icons.chat_outlined),
                ),
              ),
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
          const SizedBox(height: 12),
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: SwitchListTile(
              title: const Text('Mostrar redes sociales'),
              subtitle: const Text(
                'Muestra iconos de redes en la página de contacto',
              ),
              value: _showSocialLinks,
              onChanged: (v) => setState(() => _showSocialLinks = v),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: _save,
            icon: const Icon(Icons.save_outlined),
            label: const Text('Guardar cambios'),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _card(
    BuildContext context, {
    required String title,
    required List<Widget> children,
  }) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }
}
