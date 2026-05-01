part of 'booking_form_page.dart';

extension _BookingFormDraft on _BookingFormPageState {
  Future<void> checkDraft() async {
    final has = await ref.read(draftServiceProvider).hasDraft(_draftScope);
    if (mounted && has) setState(() => _hasDraft = true);
  }

  Future<void> restoreDraft() async {
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

  Future<void> discardDraft() async {
    await ref.read(draftServiceProvider).clear(_draftScope);
    if (mounted) setState(() => _hasDraft = false);
  }

  Future<void> saveDraftToDisk() async {
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
}
