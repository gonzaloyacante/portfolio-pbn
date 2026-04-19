import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

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

class _BookingFormPageState extends ConsumerState<BookingFormPage> {
  final _formKey = GlobalKey<FormState>();
  bool _saving = false;
  bool _isDirty = false;
  bool _prefilled = false;

  bool get _isEdit => widget.bookingId != null;

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
    // Pre-populate serviceId if navigated from service tile/detail.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final extra = GoRouterState.of(context).extra;
      if (extra is Map<String, dynamic> && extra['serviceId'] is String) {
        setState(() => _serviceId = extra['serviceId'] as String);
      }
    });
  }

  @override
  void dispose() {
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
