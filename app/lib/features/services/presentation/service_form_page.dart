import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/utils/draft_service.dart';
import '../data/service_model.dart';
import '../data/services_repository.dart';
import '../providers/services_provider.dart';
import 'widgets/pricing_tiers_editor.dart';
import 'widgets/video_url_field.dart';

part 'service_form_page_builders.dart';

final _reServiceWhitespace = RegExp(r'\s+');
// ignore: deprecated_member_use
final _reServiceNonSlug = RegExp(r'[^a-z0-9-]');

class ServiceFormPage extends ConsumerStatefulWidget {
  const ServiceFormPage({super.key, this.serviceId});

  final String? serviceId;

  @override
  ConsumerState<ServiceFormPage> createState() => _ServiceFormPageState();
}

class _ServiceFormPageState extends ConsumerState<ServiceFormPage>
    with WidgetsBindingObserver {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _slugCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _shortDescCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _videoUrlCtrl = TextEditingController();
  final _durationCtrl = TextEditingController();
  final _durationMinutesCtrl = TextEditingController();
  final _maxBookingsCtrl = TextEditingController();
  final _advanceNoticeCtrl = TextEditingController();
  final _requirementsCtrl = TextEditingController();
  final _cancellationPolicyCtrl = TextEditingController();
  final _imageCtrl = TextEditingController();
  File? _pendingImage;
  String _priceLabel = 'desde';
  String _currency = 'EUR';
  List<ServicePricingTierItem> _pricingTiers = const [];
  bool _isActive = true;
  bool _isFeatured = false;
  bool _isAvailable = true;
  bool _loading = false;
  bool _populated = false;
  bool _isDirty = false;
  bool _hasDraft = false;

  bool get _isEdit => widget.serviceId != null;

  String get _draftScope =>
      _isEdit ? 'service_edit__${widget.serviceId}' : 'service_new';

  List<TextEditingController> get _formControllers => [
    _nameCtrl,
    _slugCtrl,
    _descCtrl,
    _shortDescCtrl,
    _priceCtrl,
    _videoUrlCtrl,
    _durationCtrl,
    _durationMinutesCtrl,
    _maxBookingsCtrl,
    _advanceNoticeCtrl,
    _requirementsCtrl,
    _cancellationPolicyCtrl,
    _imageCtrl,
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _checkDraft();
  }

  Future<void> _checkDraft() async {
    final has = await ref.read(draftServiceProvider).hasDraft(_draftScope);
    if (mounted && has) setState(() => _hasDraft = true);
  }

  Future<void> _restoreDraft() async {
    final data = await ref.read(draftServiceProvider).load(_draftScope);
    if (data == null || !mounted) return;
    setState(() {
      _nameCtrl.text = data['name'] as String? ?? '';
      _slugCtrl.text = data['slug'] as String? ?? '';
      _descCtrl.text = data['description'] as String? ?? '';
      _shortDescCtrl.text = data['shortDesc'] as String? ?? '';
      _priceCtrl.text = data['price'] as String? ?? '';
      _durationCtrl.text = data['duration'] as String? ?? '';
      _durationMinutesCtrl.text = data['durationMinutes'] as String? ?? '';
      _maxBookingsCtrl.text = data['maxBookingsPerDay'] as String? ?? '';
      _advanceNoticeCtrl.text = data['advanceNoticeDays'] as String? ?? '';
      _requirementsCtrl.text = data['requirements'] as String? ?? '';
      _cancellationPolicyCtrl.text =
          data['cancellationPolicy'] as String? ?? '';
      _imageCtrl.text = data['imageUrl'] as String? ?? '';
      _videoUrlCtrl.text = data['videoUrl'] as String? ?? '';
      _priceLabel = data['priceLabel'] as String? ?? 'desde';
      _isActive = data['isActive'] as bool? ?? true;
      _isFeatured = data['isFeatured'] as bool? ?? false;
      _isAvailable = data['isAvailable'] as bool? ?? true;
      _isDirty = true;
      _hasDraft = false;
    });
  }

  Future<void> _discardDraft() async {
    await ref.read(draftServiceProvider).clear(_draftScope);
    if (mounted) setState(() => _hasDraft = false);
  }

  Future<void> _saveDraft() async {
    if (!_isDirty) return;
    await ref.read(draftServiceProvider).save(_draftScope, {
      'name': _nameCtrl.text,
      'slug': _slugCtrl.text,
      'description': _descCtrl.text,
      'shortDesc': _shortDescCtrl.text,
      'price': _priceCtrl.text,
      'duration': _durationCtrl.text,
      'durationMinutes': _durationMinutesCtrl.text,
      'maxBookingsPerDay': _maxBookingsCtrl.text,
      'advanceNoticeDays': _advanceNoticeCtrl.text,
      'requirements': _requirementsCtrl.text,
      'cancellationPolicy': _cancellationPolicyCtrl.text,
      'imageUrl': _imageCtrl.text,
      'videoUrl': _videoUrlCtrl.text,
      'priceLabel': _priceLabel,
      'isActive': _isActive,
      'isFeatured': _isFeatured,
      'isAvailable': _isAvailable,
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive) {
      _saveDraft();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    for (final ctrl in _formControllers) {
      ctrl.dispose();
    }
    super.dispose();
  }

  void _markDirty() {
    if (!_isDirty) _rebuild(() => _isDirty = true);
  }

  @override
  Widget build(BuildContext context) => _buildContent(context);

  void _rebuild(VoidCallback fn) => setState(fn);
}
