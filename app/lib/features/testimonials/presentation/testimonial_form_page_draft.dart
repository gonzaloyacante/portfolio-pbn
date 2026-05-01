part of 'testimonial_form_page.dart';

extension _TestimonialFormDraft on _TestimonialFormPageState {
  Future<void> checkDraft() async {
    final has = await ref.read(draftServiceProvider).hasDraft(_draftScope);
    if (mounted && has) setState(() => _hasDraft = true);
  }

  Future<void> restoreDraft() async {
    final data = await ref.read(draftServiceProvider).load(_draftScope);
    if (data == null || !mounted) return;
    setState(() {
      _nameCtrl.text = data['name'] as String? ?? '';
      _textCtrl.text = data['text'] as String? ?? '';
      _emailCtrl.text = data['email'] as String? ?? '';
      _positionCtrl.text = data['position'] as String? ?? '';
      _companyCtrl.text = data['company'] as String? ?? '';
      _rating = data['rating'] as int? ?? 5;
      _verified = data['verified'] as bool? ?? false;
      _featured = data['featured'] as bool? ?? false;
      _isActive = data['isActive'] as bool? ?? true;
      _status = data['status'] as String? ?? 'PENDING';
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
      'text': _textCtrl.text,
      'email': _emailCtrl.text,
      'position': _positionCtrl.text,
      'company': _companyCtrl.text,
      'rating': _rating,
      'verified': _verified,
      'featured': _featured,
      'isActive': _isActive,
      'status': _status,
    });
  }
}
