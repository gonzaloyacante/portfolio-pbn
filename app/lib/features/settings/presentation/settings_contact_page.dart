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

  List<TextEditingController> get _textControllers => [
    _pageTitleCtrl,
    _ownerNameCtrl,
    _emailCtrl,
    _phoneCtrl,
    _whatsappCtrl,
    _locationCtrl,
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
