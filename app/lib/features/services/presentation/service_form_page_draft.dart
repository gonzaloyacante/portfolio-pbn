part of 'service_form_page.dart';

extension _ServiceFormDraft on _ServiceFormPageState {
  Future<void> checkDraft() async {
    final has = await ref.read(draftServiceProvider).hasDraft(_draftScope);
    if (mounted && has) setState(() => _hasDraft = true);
  }

  Future<void> restoreDraft() async {
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

  Future<void> discardDraft() async {
    await ref.read(draftServiceProvider).clear(_draftScope);
    if (mounted) setState(() => _hasDraft = false);
  }

  Future<void> saveDraftToDisk() async {
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
}
