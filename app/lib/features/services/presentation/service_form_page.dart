import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/api/upload_service.dart';
import '../data/service_model.dart';
import '../data/services_repository.dart';
import '../providers/services_provider.dart';
import 'widgets/pricing_tiers_editor.dart';
import 'widgets/video_url_field.dart';

// Patrones de slug compilados una sola vez
// ignore: deprecated_member_use

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

class _ServiceFormPageState extends ConsumerState<ServiceFormPage> {
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

  bool get _isEdit => widget.serviceId != null;

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
  void dispose() {
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
