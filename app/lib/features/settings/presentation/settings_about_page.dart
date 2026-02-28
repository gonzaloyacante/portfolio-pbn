import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/image_upload_widget.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';

class SettingsAboutPage extends ConsumerStatefulWidget {
  const SettingsAboutPage({super.key});

  @override
  ConsumerState<SettingsAboutPage> createState() => _SettingsAboutPageState();
}

class _SettingsAboutPageState extends ConsumerState<SettingsAboutPage> {
  bool _saving = false;
  bool _populated = false;

  final _bioTitleCtrl = TextEditingController();
  final _bioIntroCtrl = TextEditingController();
  final _bioDescCtrl = TextEditingController();
  final _yearsCtrl = TextEditingController();
  final _profileImageCtrl = TextEditingController();
  File? _pendingProfileImage;
  final _skillsCtrl = TextEditingController(); // comma-separated

  @override
  void dispose() {
    _bioTitleCtrl.dispose();
    _bioIntroCtrl.dispose();
    _bioDescCtrl.dispose();
    _yearsCtrl.dispose();
    _profileImageCtrl.dispose();
    _skillsCtrl.dispose();
    super.dispose();
  }

  void _populate(AboutSettings s) {
    if (_populated) return;
    _populated = true;
    _bioTitleCtrl.text = s.bioTitle ?? '';
    _bioIntroCtrl.text = s.bioIntro ?? '';
    _bioDescCtrl.text = s.bioDescription ?? '';
    _yearsCtrl.text = s.yearsExperience?.toString() ?? '';
    _profileImageCtrl.text = s.profileImageUrl ?? '';
    _skillsCtrl.text = s.skills.join(', ');
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      // Subir imagen de perfil si se seleccionó una nueva.
      if (_pendingProfileImage != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        _profileImageCtrl.text = await uploadSvc.uploadImage(
          _pendingProfileImage!,
          folder: 'portfolio/about',
        );
      }

      await ref.read(settingsRepositoryProvider).updateAbout({
        'bioTitle': _bioTitleCtrl.text.trim().isEmpty
            ? null
            : _bioTitleCtrl.text.trim(),
        'bioIntro': _bioIntroCtrl.text.trim().isEmpty
            ? null
            : _bioIntroCtrl.text.trim(),
        'bioDescription': _bioDescCtrl.text.trim().isEmpty
            ? null
            : _bioDescCtrl.text.trim(),
        'yearsExperience': int.tryParse(_yearsCtrl.text.trim()),
        'profileImageUrl': _profileImageCtrl.text.trim().isEmpty
            ? null
            : _profileImageCtrl.text.trim(),
        'skills': _skillsCtrl.text
            .split(',')
            .map((s) => s.trim())
            .where((s) => s.isNotEmpty)
            .toList(),
      });
      ref.invalidate(aboutSettingsProvider);
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
    final async = ref.watch(aboutSettingsProvider);

    return AppScaffold(
      title: 'Sobre mí',
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
            onRetry: () => ref.invalidate(aboutSettingsProvider),
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
          _FormCard(
            title: 'Bio',
            children: [
              TextFormField(
                controller: _bioTitleCtrl,
                decoration: const InputDecoration(labelText: 'Título'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _bioIntroCtrl,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Intro',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _bioDescCtrl,
                maxLines: 5,
                decoration: const InputDecoration(
                  labelText: 'Descripción',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _FormCard(
            title: 'Perfil',
            children: [
              ImageUploadWidget(
                label: 'Imagen de perfil',
                currentImageUrl: _profileImageCtrl.text.isNotEmpty
                    ? _profileImageCtrl.text
                    : null,
                hint: 'Foto de perfil para el é About',
                onImageSelected: (file) {
                  setState(() => _pendingProfileImage = file);
                },
                onImageRemoved: () {
                  setState(() {
                    _pendingProfileImage = null;
                    _profileImageCtrl.clear();
                  });
                },
                height: 180,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _yearsCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Años de experiencia',
                  prefixIcon: Icon(Icons.work_outline),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _FormCard(
            title: 'Habilidades',
            children: [
              TextFormField(
                controller: _skillsCtrl,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Habilidades (separadas por coma)',
                  hintText: 'Maquillaje nupcial, Efectos especiales…',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
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

// ── Shared card ───────────────────────────────────────────────────────────────

class _FormCard extends StatelessWidget {
  const _FormCard({required this.title, required this.children});
  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
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
