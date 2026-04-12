import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import '../../../core/api/upload_service.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';
import 'widgets/dynamic_item_list.dart';

part 'settings_about_page_builders.dart';

class SettingsAboutPage extends ConsumerStatefulWidget {
  const SettingsAboutPage({super.key});

  @override
  ConsumerState<SettingsAboutPage> createState() => _SettingsAboutPageState();
}

class _SettingsAboutPageState extends ConsumerState<SettingsAboutPage> {
  bool _saving = false;
  bool _populated = false;
  bool _isDirty = false;

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
  void initState() {
    super.initState();
    for (final c in [
      _bioTitleCtrl,
      _bioIntroCtrl,
      _bioDescCtrl,
      _profileImageCtrl,
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
      _bioTitleCtrl,
      _bioIntroCtrl,
      _bioDescCtrl,
      _profileImageCtrl,
    ]) {
      c.removeListener(_markDirty);
    }
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
        final result = await svc.uploadImageFull(
          _pendingProfileImage!,
          folder: 'portfolio/about',
        );
        _profileImageCtrl.text = result.url;
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
      if (mounted) {
        setState(() => _isDirty = false);
        AppSnackBar.success(context, 'Configuración guardada');
      }
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

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) =>
          _maybeLeave(context),
      child: AppScaffold(
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
            loading: () =>
                const SkeletonSettingsPage(cardCount: 3, fieldsPerCard: 3),
            error: (e, _) => ErrorState(
              message: e.toString(),
              onRetry: () => ref.invalidate(aboutSettingsProvider),
            ),
            data: (settings) {
              _populate(settings);
              return RefreshIndicator(
                onRefresh: () async {
                  ref.invalidate(aboutSettingsProvider);
                  await ref.read(aboutSettingsProvider.future);
                },
                child: _buildForm(context),
              );
            },
          ),
        ),
      ),
    );
  }
}
