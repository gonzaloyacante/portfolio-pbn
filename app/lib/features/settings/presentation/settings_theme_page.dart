import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/color_usage_bottom_sheet.dart';
import 'widgets/settings_form_card.dart';
import 'widgets/theme_color_preview.dart';

part 'settings_theme_page_builders.dart';

class SettingsThemePage extends ConsumerStatefulWidget {
  const SettingsThemePage({super.key});

  @override
  ConsumerState<SettingsThemePage> createState() => _SettingsThemePageState();
}

class _SettingsThemePageState extends ConsumerState<SettingsThemePage> {
  bool _saving = false;
  bool _populated = false;
  bool _isDirty = false;

  // ── Light colors ────────────────────────────────────────────────────────
  final _primaryCtrl = TextEditingController();
  final _secondaryCtrl = TextEditingController();
  final _accentCtrl = TextEditingController();
  final _bgCtrl = TextEditingController();
  final _textCtrl = TextEditingController();
  final _cardBgCtrl = TextEditingController();

  // ── Dark colors ─────────────────────────────────────────────────────────
  final _darkPrimaryCtrl = TextEditingController();
  final _darkSecondaryCtrl = TextEditingController();
  final _darkAccentCtrl = TextEditingController();
  final _darkBgCtrl = TextEditingController();
  final _darkTextCtrl = TextEditingController();
  final _darkCardBgCtrl = TextEditingController();

  // ── Fonts ───────────────────────────────────────────────────────────────
  final _headingFontCtrl = TextEditingController();
  final _bodyFontCtrl = TextEditingController();
  final _scriptFontCtrl = TextEditingController();
  final _brandFontCtrl = TextEditingController();
  final _portfolioFontCtrl = TextEditingController();
  final _signatureFontCtrl = TextEditingController();

  // ── Font sizes ──────────────────────────────────────────────────────────
  final _headingFontSizeCtrl = TextEditingController();
  final _bodyFontSizeCtrl = TextEditingController();
  final _scriptFontSizeCtrl = TextEditingController();
  final _brandFontSizeCtrl = TextEditingController();
  final _portfolioFontSizeCtrl = TextEditingController();
  final _signatureFontSizeCtrl = TextEditingController();

  // ── Layout ──────────────────────────────────────────────────────────────
  final _borderRadiusCtrl = TextEditingController();

  /// Controllers that drive the live color preview.
  List<TextEditingController> get _previewControllers => [
    _primaryCtrl,
    _secondaryCtrl,
    _bgCtrl,
    _darkPrimaryCtrl,
    _darkBgCtrl,
  ];

  /// All controllers — used in dispose.
  List<TextEditingController> get _allControllers => [
    _primaryCtrl,
    _secondaryCtrl,
    _accentCtrl,
    _bgCtrl,
    _textCtrl,
    _cardBgCtrl,
    _darkPrimaryCtrl,
    _darkSecondaryCtrl,
    _darkAccentCtrl,
    _darkBgCtrl,
    _darkTextCtrl,
    _darkCardBgCtrl,
    _headingFontCtrl,
    _bodyFontCtrl,
    _scriptFontCtrl,
    _brandFontCtrl,
    _portfolioFontCtrl,
    _signatureFontCtrl,
    _headingFontSizeCtrl,
    _bodyFontSizeCtrl,
    _scriptFontSizeCtrl,
    _brandFontSizeCtrl,
    _portfolioFontSizeCtrl,
    _signatureFontSizeCtrl,
    _borderRadiusCtrl,
  ];

  @override
  void initState() {
    super.initState();
    for (final c in _previewControllers) {
      c.addListener(_refresh);
    }
  }

  void _refresh() {
    _markDirty();
    setState(() {});
  }

  void _markDirty() {
    if (!_isDirty) setState(() => _isDirty = true);
  }

  @override
  void dispose() {
    for (final c in _previewControllers) {
      c.removeListener(_refresh);
    }
    for (final c in _allControllers) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => _buildScaffold(context);
}
