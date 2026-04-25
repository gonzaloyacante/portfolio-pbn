import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/utils/draft_service.dart';
import '../../../core/utils/validators.dart';
import '../../../shared/widgets/widgets.dart';
import '../../services/providers/services_provider.dart';
import '../data/booking_model.dart';
import '../providers/calendar_provider.dart';
import '../../../core/theme/app_radius.dart';
part 'booking_form_page_builders.dart';

class BookingFormPage extends ConsumerStatefulWidget {
  const BookingFormPage({super.key, this.bookingId});

  final String? bookingId;

  @override
  ConsumerState<BookingFormPage> createState() => _BookingFormPageState();
}

class _BookingFormPageState extends ConsumerState<BookingFormPage>
    with WidgetsBindingObserver {
  final _formKey = GlobalKey<FormState>();
  bool _saving = false;
  bool _isDirty = false;
  bool _prefilled = false;
  bool _hasDraft = false;

  bool get _isEdit => widget.bookingId != null;

  String get _draftScope =>
      _isEdit ? 'booking_edit__${widget.bookingId}' : 'booking_new';

  final _clientNameCtrl = TextEditingController();
  final _clientEmailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();
  final _adminNotesCtrl = TextEditingController();
  final _guestCountCtrl = TextEditingController();

  DateTime? _date;
  String? _serviceId;
  String? _currentStatus;
  String? _paymentMethod;
  String? _paymentStatus = 'PENDING';
  final _totalAmountCtrl = TextEditingController();

  List<TextEditingController> get _controllers => [
    _clientNameCtrl,
    _clientEmailCtrl,
    _phoneCtrl,
    _notesCtrl,
    _adminNotesCtrl,
    _guestCountCtrl,
    _totalAmountCtrl,
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final extra = GoRouterState.of(context).extra;
      if (extra is Map<String, dynamic> && extra['serviceId'] is String) {
        setState(() => _serviceId = extra['serviceId'] as String);
      }
    });
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
      _clientNameCtrl.text = data['clientName'] as String? ?? '';
      _clientEmailCtrl.text = data['clientEmail'] as String? ?? '';
      _phoneCtrl.text = data['phone'] as String? ?? '';
      _notesCtrl.text = data['notes'] as String? ?? '';
      _adminNotesCtrl.text = data['adminNotes'] as String? ?? '';
      _guestCountCtrl.text = data['guestCount'] as String? ?? '';
      _totalAmountCtrl.text = data['totalAmount'] as String? ?? '';
      _serviceId = data['serviceId'] as String?;
      _paymentMethod = data['paymentMethod'] as String?;
      _paymentStatus = data['paymentStatus'] as String? ?? 'PENDING';
      final dateStr = data['date'] as String?;
      if (dateStr != null) _date = DateTime.tryParse(dateStr);
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
      'clientName': _clientNameCtrl.text,
      'clientEmail': _clientEmailCtrl.text,
      'phone': _phoneCtrl.text,
      'notes': _notesCtrl.text,
      'adminNotes': _adminNotesCtrl.text,
      'guestCount': _guestCountCtrl.text,
      'totalAmount': _totalAmountCtrl.text,
      'serviceId': _serviceId,
      'paymentMethod': _paymentMethod,
      'paymentStatus': _paymentStatus,
      'date': _date?.toIso8601String(),
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
    for (final ctrl in _controllers) {
      ctrl.dispose();
    }
    super.dispose();
  }

  void _markDirty() {
    if (!_isDirty) setState(() => _isDirty = true);
  }

  @override
  Widget build(BuildContext context) => _buildPage(context);
}
