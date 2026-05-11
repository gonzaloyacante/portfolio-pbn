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
part 'booking_form_page_draft.dart';
part 'booking_form_page_builders_select.dart';
part 'booking_form_page_builders_form.dart';
part 'booking_form_page_builders_page.dart';

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
      if (extra is Map<String, Object?> && extra['serviceId'] is String) {
        setState(() => _serviceId = extra['serviceId'] as String);
      }
    });
    checkDraft();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive) {
      saveDraftToDisk();
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
