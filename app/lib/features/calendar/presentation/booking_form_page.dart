import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'package:intl_phone_field/intl_phone_field.dart';

import '../../../core/utils/validators.dart';
import '../../../shared/widgets/widgets.dart';
import '../../services/providers/services_provider.dart';
import '../data/booking_model.dart';
import '../providers/calendar_provider.dart';
import '../../../core/theme/app_radius.dart';

class BookingFormPage extends ConsumerStatefulWidget {
  const BookingFormPage({super.key});

  @override
  ConsumerState<BookingFormPage> createState() => _BookingFormPageState();
}

class _BookingFormPageState extends ConsumerState<BookingFormPage> {
  final _formKey = GlobalKey<FormState>();
  bool _saving = false;
  bool _isDirty = false;

  final _clientNameCtrl = TextEditingController();
  final _clientEmailCtrl = TextEditingController();
  String? _completeClientPhone;
  final _notesCtrl = TextEditingController();
  final _guestCountCtrl = TextEditingController();

  DateTime? _date;
  String? _serviceId;

  @override
  void dispose() {
    _clientNameCtrl.dispose();
    _clientEmailCtrl.dispose();
    _notesCtrl.dispose();
    _guestCountCtrl.dispose();
    super.dispose();
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
      initialDate: _date != null && _date!.isAfter(today) ? _date! : today,
      firstDate: today,
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
        clientPhone: (_completeClientPhone?.trim().isEmpty ?? true)
            ? null
            : _completeClientPhone!.trim(),
        guestCount: int.tryParse(_guestCountCtrl.text.trim()) ?? 1,
        clientNotes: _notesCtrl.text.trim().isEmpty
            ? null
            : _notesCtrl.text.trim(),
        serviceId: _serviceId!,
      );
      await repo.createBooking(data);
      ref.invalidate(bookingsListProvider);
      if (mounted) {
        HapticFeedback.lightImpact();
        context.pop();
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No se pudo crear la reserva. Inténtalo de nuevo.'),
          ),
        );
        setState(() => _saving = false);
      }
    }
  }

  Widget _buildServiceSelector() {
    final servicesAsync = ref.watch(servicesListProvider());
    return servicesAsync.when(
      loading: () => const ShimmerBox(
        width: double.infinity,
        height: 56,
        borderRadius: 12,
      ),
      error: (err, _) => ErrorState(
        message: 'No se pudieron cargar los servicios',
        onRetry: () => ref.invalidate(servicesListProvider()),
      ),
      data: (paginated) {
        final services = paginated.data;
        if (services.isEmpty) {
          return const Text('No hay servicios disponibles');
        }
        return DropdownButtonFormField<String>(
          value: _serviceId,
          decoration: const InputDecoration(
            labelText: 'Servicio *',
            hintText: 'Selecciona un servicio',
          ),
          isExpanded: true,
          items: services
              .map(
                (s) => DropdownMenuItem(
                  value: s.id,
                  child: Text(s.name, overflow: TextOverflow.ellipsis),
                ),
              )
              .toList(),
          onChanged: (v) => setState(() => _serviceId = v),
          validator: (v) => v == null ? 'Selecciona un servicio' : null,
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final dateLabel = _date == null
        ? 'Seleccionar fecha y hora'
        : '${_date!.day}/${_date!.month}/${_date!.year}  '
              '${_date!.hour.toString().padLeft(2, '0')}:'
              '${_date!.minute.toString().padLeft(2, '0')}';

    return LoadingOverlay(
      isLoading: _saving,
      child: PopScope(
        canPop: false,
        onPopInvokedWithResult: (bool didPop, dynamic result) =>
            _maybeLeave(context),
        child: Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => _maybeLeave(context),
              tooltip: 'Volver',
            ),
            title: const Text('Nueva reserva'),
            centerTitle: false,
            actions: [
              TextButton(onPressed: _submit, child: const Text('GUARDAR')),
            ],
          ),
          body: Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // ── Datos del cliente ────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Datos del cliente',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _clientNameCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Nombre *',
                        ),
                        textCapitalization: TextCapitalization.words,
                        onChanged: (_) => _markDirty(),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) {
                            return 'Obligatorio';
                          }
                          if (v.trim().length < 2) return 'Mínimo 2 caracteres';
                          return null;
                        },
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _clientEmailCtrl,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(labelText: 'Email *'),
                        validator: AppValidators.email,
                      ),
                      const SizedBox(height: 12),
                      IntlPhoneField(
                        decoration: const InputDecoration(
                          labelText: 'Teléfono',
                          counterText: '',
                        ),
                        initialCountryCode: 'ES',
                        invalidNumberMessage: 'Número de teléfono inválido',
                        keyboardType: TextInputType.phone,
                        onChanged: (phone) {
                          _completeClientPhone = phone.completeNumber;
                        },
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _guestCountCtrl,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          labelText: 'Nº de asistentes',
                        ),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) return null;
                          final n = int.tryParse(v.trim());
                          if (n == null || n < 1) return 'Mínimo 1 asistente';
                          if (n > 999) return 'Máximo 999 asistentes';
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                // ── Fecha y hora ─────────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  padding: EdgeInsets.zero,
                  child: ListTile(
                    leading: const Icon(Icons.calendar_month_outlined),
                    title: Text(dateLabel),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: _pickDateTime,
                  ),
                ),
                const SizedBox(height: 12),
                // ── Servicio ─────────────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Servicio',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildServiceSelector(),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                // ── Notas ────────────────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Notas',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _notesCtrl,
                        maxLines: 4,
                        decoration: const InputDecoration(
                          hintText: 'Observaciones, peticiones especiales…',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                FilledButton.icon(
                  onPressed: _submit,
                  icon: const Icon(Icons.save_outlined),
                  label: const Text('Crear reserva'),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
