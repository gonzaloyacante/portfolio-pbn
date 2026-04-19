import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/utils/app_logger.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/settings_model.dart';
import '../providers/settings_provider.dart';
import 'widgets/settings_form_card.dart';
import 'widgets/collapsible_preview.dart';
import 'widgets/featured_count_picker.dart';
import 'widgets/hero_image_picker.dart';
import 'widgets/live_hero_preview.dart';
import 'widgets/sticky_preview_column.dart';

part 'settings_home_page_builders.dart';
part 'settings_home_page_actions.dart';

class SettingsHomePage extends ConsumerStatefulWidget {
  const SettingsHomePage({super.key});

  @override
  ConsumerState<SettingsHomePage> createState() => _SettingsHomePageState();
}

class _SettingsHomePageState extends ConsumerState<SettingsHomePage> {
  bool _saving = false;
  bool _populated = false;
  bool _isDirty = false;

  // Hero
  final _title1Ctrl = TextEditingController();
  final _title2Ctrl = TextEditingController();
  final _ownerNameCtrl = TextEditingController();
  final _heroImageCtrl = TextEditingController();
  final _heroImageAltCtrl = TextEditingController();
  File? _pendingHeroImage;

  // CTA
  final _ctaTextCtrl = TextEditingController();
  final _ctaLinkCtrl = TextEditingController();

  // Featured
  bool _showFeatured = true;
  final _featuredTitleCtrl = TextEditingController();
  int _featuredCount = 3;

  // Illustration
  File? _pendingIllustration;

  // Preview options
  String _previewDevice = 'desktop'; // desktop, tablet, mobile
  bool _previewDarkMode = false;

  // Extended design fields (fonts, font URLs, colors, caption, alt texts)
  final Map<String, TextEditingController> _extraCtrls = {};

  // Numeric / enum design values (font sizes, z-indexes, offsets, styles…)
  final Map<String, dynamic> _vals = {};

  // ignore: use_setters_to_change_properties
  void _rebuild(VoidCallback fn) => setState(fn);

  void _markDirty() {
    if (!_isDirty) _rebuild(() => _isDirty = true);
  }

  @override
  void initState() {
    super.initState();
    // Escuchamos cambios en los controllers para refrescar el live preview
    for (final c in [_title1Ctrl, _title2Ctrl, _ownerNameCtrl, _ctaTextCtrl]) {
      c.addListener(_onPreviewChange);
    }
  }

  @override
  void dispose() {
    for (final c in [_title1Ctrl, _title2Ctrl, _ownerNameCtrl, _ctaTextCtrl]) {
      c.removeListener(_onPreviewChange);
    }
    for (final c in [
      _title1Ctrl,
      _title2Ctrl,
      _ownerNameCtrl,
      _heroImageCtrl,
      _heroImageAltCtrl,
      _ctaTextCtrl,
      _ctaLinkCtrl,
      _featuredTitleCtrl,
    ]) {
      c.dispose();
    }
    for (final c in _extraCtrls.values) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => _buildScaffold(context);
}
