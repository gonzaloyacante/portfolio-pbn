import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import '../../../core/api/upload_service.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_snack_bar.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/image_upload_widget.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';

class SettingsAboutPage extends ConsumerStatefulWidget {
  const SettingsAboutPage({super.key});

  @override
  ConsumerState<SettingsAboutPage> createState() => _SettingsAboutPageState();
}

class _SettingsAboutPageState extends ConsumerState<SettingsAboutPage> {
  bool _saving = false;
  bool _populated = false;

  File? _pendingProfileImage;

  final _bioTitleCtrl = TextEditingController();
  final _bioIntroCtrl = TextEditingController();
  final _bioDescCtrl = TextEditingController();
  final _profileImageCtrl = TextEditingController();

  final List<TextEditingController> _skillsCtrls = [];
  final List<FocusNode> _skillsFocus = [];

  final List<TextEditingController> _certificationsCtrls = [];
  final List<FocusNode> _certificationsFocus = [];

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  @override
  void dispose() {
    _bioTitleCtrl.dispose();
    _bioIntroCtrl.dispose();
    _bioDescCtrl.dispose();
    _profileImageCtrl.dispose();
    for (final c in _skillsCtrls) {
      c.dispose();
    }
    for (final f in _skillsFocus) {
      f.dispose();
    }
    for (final c in _certificationsCtrls) {
      c.dispose();
    }
    for (final f in _certificationsFocus) {
      f.dispose();
    }
    super.dispose();
  }

  // ── Populate ──────────────────────────────────────────────────────────────

  void _populate(AboutSettings s) {
    if (_populated) return;
    _populated = true;

    _bioTitleCtrl.text = s.bioTitle ?? '';
    _bioIntroCtrl.text = s.bioIntro ?? '';
    _bioDescCtrl.text = s.bioDescription ?? '';
    _profileImageCtrl.text = s.profileImageUrl ?? '';

    _populateList(s.skills, _skillsCtrls, _skillsFocus);
    _populateList(s.certifications, _certificationsCtrls, _certificationsFocus);

    if (_skillsCtrls.isEmpty) _addField(_skillsCtrls, _skillsFocus);
    if (_certificationsCtrls.isEmpty) {
      _addField(_certificationsCtrls, _certificationsFocus);
    }
  }

  void _populateList(
    List<String> items,
    List<TextEditingController> ctrls,
    List<FocusNode> focusNodes,
  ) {
    for (final c in ctrls) {
      c.dispose();
    }
    for (final f in focusNodes) {
      f.dispose();
    }
    ctrls.clear();
    focusNodes.clear();

    final expanded = items
        .expand((v) => v.split('\n'))
        .expand((v) => v.split(','))
        .map((v) => v.trim())
        .where((v) => v.isNotEmpty)
        .toList();

    for (final value in expanded) {
      ctrls.add(TextEditingController(text: value));
      focusNodes.add(FocusNode());
    }
  }

  void _addField(
    List<TextEditingController> ctrls,
    List<FocusNode> focusNodes,
  ) {
    ctrls.add(TextEditingController());
    focusNodes.add(FocusNode());
  }

  void _removeField(
    int i,
    List<TextEditingController> ctrls,
    List<FocusNode> focusNodes,
  ) {
    if (i < 0 || i >= ctrls.length) return;
    ctrls.removeAt(i).dispose();
    focusNodes.removeAt(i).dispose();
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      if (_pendingProfileImage != null) {
        final svc = ref.read(uploadServiceProvider);
        _profileImageCtrl.text = await svc.uploadImage(
          _pendingProfileImage!,
          folder: 'portfolio/about',
        );
      }

      await ref.read(settingsRepositoryProvider).updateAbout({
        'bioTitle': _nullIfEmpty(_bioTitleCtrl.text),
        'bioIntro': _nullIfEmpty(_bioIntroCtrl.text),
        'bioDescription': _nullIfEmpty(_bioDescCtrl.text),
        'profileImageUrl': _nullIfEmpty(_profileImageCtrl.text),
        'skills': _skillsCtrls
            .map((c) => c.text.trim())
            .where((s) => s.isNotEmpty)
            .toList(),
        'certifications': _certificationsCtrls
            .map((c) => c.text.trim())
            .where((s) => s.isNotEmpty)
            .toList(),
      });

      ref.invalidate(aboutSettingsProvider);
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

  String? _nullIfEmpty(String v) => v.trim().isEmpty ? null : v.trim();

  // ── Build ─────────────────────────────────────────────────────────────────

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
          loading: _buildShimmer,
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

  // ── Shimmer ───────────────────────────────────────────────────────────────

  Widget _buildShimmer() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.base),
      children: List.generate(
        5,
        (_) => Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.md),
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

  // ── Form ──────────────────────────────────────────────────────────────────

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
              // ── Bio ──────────────────────────────────────────────────────
              SettingsFormCard(
                title: 'Bio',
                children: [
                  TextFormField(
                    controller: _bioTitleCtrl,
                    decoration: const InputDecoration(labelText: 'Título'),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _bioIntroCtrl,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Intro',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
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
              const SizedBox(height: AppSpacing.md),

              // ── Perfil ───────────────────────────────────────────────────
              SettingsFormCard(
                title: 'Imagen de perfil',
                children: [
                  ImageUploadWidget(
                    label: 'Foto de perfil',
                    currentImageUrl: _profileImageCtrl.text.isNotEmpty
                        ? _profileImageCtrl.text
                        : null,
                    hint: 'Foto de perfil para la sección About',
                    onImageSelected: (file) =>
                        setState(() => _pendingProfileImage = file),
                    onImageRemoved: () => setState(() {
                      _pendingProfileImage = null;
                      _profileImageCtrl.clear();
                    }),
                    height: AppBreakpoints.value<double>(
                      context,
                      compact: 160,
                      medium: 200,
                      expanded: 220,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Habilidades ──────────────────────────────────────────────
              SettingsFormCard(
                title: 'Habilidades',
                children: [
                  _DynamicItemList(
                    controllers: _skillsCtrls,
                    focusNodes: _skillsFocus,
                    labelPrefix: 'Habilidad',
                    addLabel: 'Agregar habilidad',
                    onAdd: () =>
                        setState(() => _addField(_skillsCtrls, _skillsFocus)),
                    onRemove: (i) => setState(() {
                      _removeField(i, _skillsCtrls, _skillsFocus);
                      if (_skillsCtrls.isEmpty) {
                        _addField(_skillsCtrls, _skillsFocus);
                      }
                    }),
                    onSubmit: () => setState(() {
                      _addField(_skillsCtrls, _skillsFocus);
                      Future.microtask(() => _skillsFocus.last.requestFocus());
                    }),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Certificaciones ──────────────────────────────────────────
              SettingsFormCard(
                title: 'Certificaciones',
                children: [
                  _DynamicItemList(
                    controllers: _certificationsCtrls,
                    focusNodes: _certificationsFocus,
                    labelPrefix: 'Certificación',
                    addLabel: 'Agregar certificación',
                    onAdd: () => setState(
                      () =>
                          _addField(_certificationsCtrls, _certificationsFocus),
                    ),
                    onRemove: (i) => setState(() {
                      _removeField(
                        i,
                        _certificationsCtrls,
                        _certificationsFocus,
                      );
                      if (_certificationsCtrls.isEmpty) {
                        _addField(_certificationsCtrls, _certificationsFocus);
                      }
                    }),
                    onSubmit: () => setState(() {
                      _addField(_certificationsCtrls, _certificationsFocus);
                      Future.microtask(
                        () => _certificationsFocus.last.requestFocus(),
                      );
                    }),
                  ),
                ],
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

// ── Lista dinámica de items ───────────────────────────────────────────────────

class _DynamicItemList extends StatelessWidget {
  const _DynamicItemList({
    required this.controllers,
    required this.focusNodes,
    required this.labelPrefix,
    required this.addLabel,
    required this.onAdd,
    required this.onRemove,
    required this.onSubmit,
  });

  final List<TextEditingController> controllers;
  final List<FocusNode> focusNodes;
  final String labelPrefix;
  final String addLabel;
  final VoidCallback onAdd;
  final ValueChanged<int> onRemove;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (controllers.isNotEmpty)
          LayoutBuilder(
            builder: (context, constraints) {
              final cols = AppBreakpoints.isTablet(context) ? 2 : 1;
              const spacing = AppSpacing.sm;
              final itemWidth =
                  (constraints.maxWidth - spacing * (cols - 1)) / cols;

              return Wrap(
                spacing: spacing,
                runSpacing: AppSpacing.sm,
                children: List.generate(controllers.length, (i) {
                  return SizedBox(
                    width: itemWidth,
                    child: Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: controllers[i],
                            focusNode: focusNodes[i],
                            textInputAction: i < controllers.length - 1
                                ? TextInputAction.next
                                : TextInputAction.done,
                            decoration: InputDecoration(
                              labelText: '$labelPrefix ${i + 1}',
                              border: const OutlineInputBorder(),
                              isDense: true,
                            ),
                            onFieldSubmitted: (_) => onSubmit(),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.xs),
                        IconButton(
                          icon: const Icon(Icons.delete_outline),
                          iconSize: 20,
                          tooltip: 'Eliminar',
                          visualDensity: VisualDensity.compact,
                          onPressed: () => onRemove(i),
                        ),
                      ],
                    ),
                  );
                }),
              );
            },
          ),
        const SizedBox(height: AppSpacing.sm),
        TextButton.icon(
          onPressed: onAdd,
          icon: const Icon(Icons.add, size: 18),
          label: Text(addLabel),
          style: TextButton.styleFrom(visualDensity: VisualDensity.compact),
        ),
      ],
    );
  }
}
