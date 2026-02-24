import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';

class SettingsSitePage extends ConsumerStatefulWidget {
  const SettingsSitePage({super.key});

  @override
  ConsumerState<SettingsSitePage> createState() => _SettingsSitePageState();
}

class _SettingsSitePageState extends ConsumerState<SettingsSitePage> {
  bool _saving = false;
  bool _populated = false;

  final _siteNameCtrl = TextEditingController();
  final _siteTaglineCtrl = TextEditingController();
  final _metaTitleCtrl = TextEditingController();
  final _metaDescCtrl = TextEditingController();
  final _gaIdCtrl = TextEditingController();
  final _maintenanceMsgCtrl = TextEditingController();

  bool _maintenanceMode = false;
  bool _showAbout = true;
  bool _showProjects = true;
  bool _showServices = false;
  bool _showContact = true;
  bool _allowIndexing = true;

  @override
  void dispose() {
    _siteNameCtrl.dispose();
    _siteTaglineCtrl.dispose();
    _metaTitleCtrl.dispose();
    _metaDescCtrl.dispose();
    _gaIdCtrl.dispose();
    _maintenanceMsgCtrl.dispose();
    super.dispose();
  }

  void _populate(SiteSettings s) {
    if (_populated) return;
    _populated = true;
    _siteNameCtrl.text = s.siteName;
    _siteTaglineCtrl.text = s.siteTagline ?? '';
    _metaTitleCtrl.text = s.defaultMetaTitle ?? '';
    _metaDescCtrl.text = s.defaultMetaDescription ?? '';
    _gaIdCtrl.text = s.googleAnalyticsId ?? '';
    _maintenanceMsgCtrl.text = s.maintenanceMessage ?? '';
    _maintenanceMode = s.maintenanceMode;
    _showAbout = s.showAboutPage;
    _showProjects = s.showProjectsPage;
    _showServices = s.showServicesPage;
    _showContact = s.showContactPage;
    _allowIndexing = s.allowIndexing;
  }

  String? _nullIfEmpty(String v) => v.trim().isEmpty ? null : v.trim();

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await ref.read(settingsRepositoryProvider).updateSite({
        'siteName': _siteNameCtrl.text.trim(),
        'siteTagline': _nullIfEmpty(_siteTaglineCtrl.text),
        'defaultMetaTitle': _nullIfEmpty(_metaTitleCtrl.text),
        'defaultMetaDescription': _nullIfEmpty(_metaDescCtrl.text),
        'googleAnalyticsId': _nullIfEmpty(_gaIdCtrl.text),
        'maintenanceMode': _maintenanceMode,
        'maintenanceMessage': _nullIfEmpty(_maintenanceMsgCtrl.text),
        'showAboutPage': _showAbout,
        'showProjectsPage': _showProjects,
        'showServicesPage': _showServices,
        'showContactPage': _showContact,
        'allowIndexing': _allowIndexing,
      });
      ref.invalidate(siteSettingsProvider);
      setState(() => _populated = false);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Configuración guardada')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(siteSettingsProvider);

    return LoadingOverlay(
      isLoading: _saving,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
            tooltip: 'Volver',
          ),
          title: const Text('Sitio Web'),
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
            onRetry: () => ref.invalidate(siteSettingsProvider),
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
          // ── Branding ─────────────────────────────────────────────────────
          _SectionCard(
            context: context,
            title: 'Branding',
            children: [
              TextFormField(
                controller: _siteNameCtrl,
                decoration: const InputDecoration(
                  labelText: 'Nombre del sitio',
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _siteTaglineCtrl,
                decoration: const InputDecoration(labelText: 'Eslogan'),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // ── SEO ───────────────────────────────────────────────────────────
          _SectionCard(
            context: context,
            title: 'SEO',
            children: [
              TextFormField(
                controller: _metaTitleCtrl,
                decoration: const InputDecoration(labelText: 'Meta título'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _metaDescCtrl,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Meta descripción',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _gaIdCtrl,
                decoration: const InputDecoration(
                  labelText: 'Google Analytics ID',
                  hintText: 'G-XXXXXXXXXX',
                  prefixIcon: Icon(Icons.analytics_outlined),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // ── Visibilidad de páginas ────────────────────────────────────────
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Visibilidad de páginas',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SwitchListTile(
                    title: const Text('Sobre mí'),
                    value: _showAbout,
                    onChanged: (v) => setState(() => _showAbout = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Proyectos'),
                    value: _showProjects,
                    onChanged: (v) => setState(() => _showProjects = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Servicios'),
                    value: _showServices,
                    onChanged: (v) => setState(() => _showServices = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Contacto'),
                    value: _showContact,
                    onChanged: (v) => setState(() => _showContact = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Permitir indexación SEO'),
                    value: _allowIndexing,
                    onChanged: (v) => setState(() => _allowIndexing = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          // ── Mantenimiento ────────────────────────────────────────────────
          Card(
            color: _maintenanceMode
                ? Colors.orange.withValues(alpha: 0.12)
                : null,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.engineering_outlined,
                        color: Colors.orange,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Modo mantenimiento',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Spacer(),
                      Switch(
                        value: _maintenanceMode,
                        onChanged: (v) => setState(() => _maintenanceMode = v),
                      ),
                    ],
                  ),
                  if (_maintenanceMode) ...[
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _maintenanceMsgCtrl,
                      maxLines: 2,
                      decoration: const InputDecoration(
                        labelText: 'Mensaje de mantenimiento',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ],
                ],
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
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.context,
    required this.title,
    required this.children,
  });
  final BuildContext context;
  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext _) {
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
