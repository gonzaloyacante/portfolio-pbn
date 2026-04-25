import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';

part 'settings_site_page_builders.dart';

class SettingsSitePage extends ConsumerStatefulWidget {
  const SettingsSitePage({super.key});

  @override
  ConsumerState<SettingsSitePage> createState() => _SettingsSitePageState();
}

class _SettingsSitePageState extends ConsumerState<SettingsSitePage> {
  bool _saving = false;
  bool _populated = false;
  bool _isDirty = false;

  final _siteNameCtrl = TextEditingController();
  final _siteTaglineCtrl = TextEditingController();
  final _metaTitleCtrl = TextEditingController();
  final _metaDescCtrl = TextEditingController();
  final _maintenanceMsgCtrl = TextEditingController();

  bool _maintenanceMode = false;
  bool _showAbout = true;
  bool _showGallery = true;
  bool _showServices = false;
  bool _showContact = true;

  // ── Encabezado / Navbar brand ──
  final _navbarBrandTextCtrl = TextEditingController();
  String? _navbarBrandFont;
  String? _navbarBrandFontUrl;
  final _navbarBrandFontSizeCtrl = TextEditingController();
  final _navbarBrandColorCtrl = TextEditingController();
  final _navbarBrandColorDarkCtrl = TextEditingController();
  bool _navbarShowBrand = true;

  List<TextEditingController> get _textControllers => [
    _siteNameCtrl,
    _siteTaglineCtrl,
    _metaTitleCtrl,
    _metaDescCtrl,
    _maintenanceMsgCtrl,
    _navbarBrandTextCtrl,
    _navbarBrandFontSizeCtrl,
    _navbarBrandColorCtrl,
    _navbarBrandColorDarkCtrl,
  ];

  @override
  void initState() {
    super.initState();
    for (final c in _textControllers) {
      c.addListener(_markDirty);
    }
  }

  void _markDirty() {
    if (!_isDirty) setState(() => _isDirty = true);
  }

  @override
  void dispose() {
    for (final c in _textControllers) {
      c.removeListener(_markDirty);
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => _buildScaffold(context);
}
