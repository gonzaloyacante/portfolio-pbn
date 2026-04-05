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
    _clientNameCtrl.dispose();
    _clientEmailCtrl.dispose();
    _phoneCtrl.dispose();
    _notesCtrl.dispose();
    _adminNotesCtrl.dispose();
    _guestCountCtrl.dispose();
    super.dispose();
  }

  void _populate(BookingDetail detail) {
    if (_prefilled) return;
    _clientNameCtrl.text = detail.clientName;
    _clientEmailCtrl.text = detail.clientEmail;
    _guestCountCtrl.text = detail.guestCount > 1 ? '${detail.guestCount}' : '';
    _notesCtrl.text = detail.clientNotes ?? '';
    _adminNotesCtrl.text = detail.adminNotes ?? '';
    _phoneCtrl.text = detail.clientPhone ?? '';
    _date = detail.date;
    _serviceId = detail.serviceId;
    _currentStatus = detail.status;
    _prefilled = true;
  }

  void _markDirty() {
    if (!_isDirty) setState(() => _isDirty = true);
  }

  Future<void> _maybeLeave(BuildContext context) async {
    if (!_isDirty) {
      context.pop();
      return;
    }
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => const ConfirmDialog(
        title: '¿Salir sin guardar?',
        message: 'Tienes cambios sin guardar.',
        confirmLabel: 'Salir',
        cancelLabel: 'Continuar editando',
      ),
    );
    if (confirmed == true && context.mounted) context.pop();
  }

  Future<void> _pickDateTime() async {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final pickedDate = await showDatePicker(
      context: context,
      initialDate: _date ?? today,
      firstDate: _isEdit ? DateTime(2020) : today,
      lastDate: DateTime(2035),
    );
    if (pickedDate == null || !mounted) return;

    final pickedTime = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(_date ?? now),
    );
    if (pickedTime == null || !mounted) return;

    setState(() {
      _date = DateTime(
        pickedDate.year,
        pickedDate.month,
        pickedDate.day,
        pickedTime.hour,
        pickedTime.minute,
      );
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_date == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona la fecha y hora')),
      );
      return;
    }
    if (_serviceId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Selecciona un servicio')));
      return;
    }

    setState(() => _saving = true);
    try {
      final repo = ref.read(bookingsRepositoryProvider);
      final data = BookingFormData(
        date: _date!,
        clientName: _clientNameCtrl.text.trim(),
        clientEmail: _clientEmailCtrl.text.trim(),
        clientPhone: (_phoneCtrl.text.trim().isEmpty)
            ? null
            : _phoneCtrl.text.trim(),
        guestCount: int.tryParse(_guestCountCtrl.text.trim()) ?? 1,
        clientNotes: _notesCtrl.text.trim().isEmpty
            ? null
            : _notesCtrl.text.trim(),
        adminNotes: _adminNotesCtrl.text.trim().isEmpty
            ? null
            : _adminNotesCtrl.text.trim(),
        serviceId: _serviceId!,
        status: _currentStatus ?? 'PENDING',
      );
      if (_isEdit) {
        await repo.updateBooking(widget.bookingId!, data.toJson());
        ref.invalidate(bookingDetailProvider(widget.bookingId!));
      } else {
        await repo.createBooking(data);
      }
      ref.invalidate(bookingsListProvider);
      if (mounted) {
        HapticFeedback.lightImpact();
        context.pop();
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _isEdit
                  ? 'No se pudo actualizar la reserva. Inténtalo de nuevo.'
                  : 'No se pudo crear la reserva. Inténtalo de nuevo.',
            ),
          ),
        );
        setState(() => _saving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isEdit && !_prefilled) {
      final async = ref.watch(bookingDetailProvider(widget.bookingId!));
      return async.when(
        loading: () => Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.pop(),
              tooltip: 'Volver',
            ),
            title: const Text('Editar reserva'),
          ),
          body: const Center(child: CircularProgressIndicator()),
        ),
        error: (e, _) => Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.pop(),
              tooltip: 'Volver',
            ),
            title: const Text('Editar reserva'),
          ),
          body: ErrorState(
            message: 'No se pudo cargar la reserva',
            onRetry: () =>
                ref.invalidate(bookingDetailProvider(widget.bookingId!)),
          ),
        ),
        data: (detail) {
          _populate(detail);
          return _buildFormScaffold(context);
        },
      );
    }
    return _buildFormScaffold(context);
  }
}
