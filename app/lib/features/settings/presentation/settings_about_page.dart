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

  List<TextEditingController> get _mainControllers => [
    _bioTitleCtrl,
    _bioIntroCtrl,
    _bioDescCtrl,
    _profileImageCtrl,
  ];

  @override
  void initState() {
    super.initState();
    for (final c in _mainControllers) {
      c.addListener(_markDirty);
    }
  }

  void _markDirty() {
    if (!_isDirty) setState(() => _isDirty = true);
  }

  @override
  void dispose() {
    for (final c in _mainControllers) {
      c.removeListener(_markDirty);
      c.dispose();
    }
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

  @override
  Widget build(BuildContext context) => _buildScaffold(context);
}
