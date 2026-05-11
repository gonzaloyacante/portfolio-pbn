part of 'service_form_page.dart';

extension _ServiceFormActions on _ServiceFormPageState {
  void _populateForm(ServiceDetail detail) {
    _nameCtrl.text = detail.name;
    _slugCtrl.text = detail.slug;
    _descCtrl.text = detail.description ?? '';
    _shortDescCtrl.text = detail.shortDesc ?? '';
    _priceCtrl.text = detail.price ?? '';
    _durationCtrl.text = detail.duration ?? '';
    _durationMinutesCtrl.text = detail.durationMinutes?.toString() ?? '';
    _maxBookingsCtrl.text = detail.maxBookingsPerDay?.toString() ?? '';
    _advanceNoticeCtrl.text = detail.advanceNoticeDays?.toString() ?? '';
    _requirementsCtrl.text = detail.requirements ?? '';
    _cancellationPolicyCtrl.text = detail.cancellationPolicy ?? '';
    _imageCtrl.text = detail.imageUrl ?? '';
    _videoUrlCtrl.text = detail.videoUrl ?? '';
    setState(() {
      _priceLabel = detail.priceLabel ?? 'desde';
      _currency = detail.currency;
      _isActive = detail.isActive;
      _isFeatured = detail.isFeatured;
      _isAvailable = detail.isAvailable;
      _pricingTiers = detail.pricingTiers;
    });
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

  void _autoSlug(String name) {
    _markDirty();
    if (_isEdit) return;
    final slug = name
        .toLowerCase()
        .replaceAll(_reServiceWhitespace, '-')
        .replaceAll(_reServiceNonSlug, '');
    _slugCtrl.text = slug;
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      if (_pendingImage != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        final result = await uploadSvc.uploadImageFull(
          _pendingImage!,
          folder: 'portfolio/services',
        );
        _imageCtrl.text = result.url;
      }

      final repo = ref.read(servicesRepositoryProvider);
      final formData = ServiceFormData(
        name: _nameCtrl.text.trim(),
        slug: _slugCtrl.text.trim(),
        description: _descCtrl.text.trim().isEmpty
            ? null
            : _descCtrl.text.trim(),
        shortDesc: _shortDescCtrl.text.trim().isEmpty
            ? null
            : _shortDescCtrl.text.trim(),
        price: _priceCtrl.text.trim().isEmpty ? null : _priceCtrl.text.trim(),
        priceLabel: _priceLabel,
        currency: _currency,
        duration: _durationCtrl.text.trim().isEmpty
            ? null
            : _durationCtrl.text.trim(),
        durationMinutes: int.tryParse(_durationMinutesCtrl.text.trim()),
        imageUrl: _imageCtrl.text.trim().isEmpty
            ? null
            : _imageCtrl.text.trim(),
        videoUrl: _videoUrlCtrl.text.trim().isEmpty
            ? null
            : _videoUrlCtrl.text.trim(),
        isActive: _isActive,
        isFeatured: _isFeatured,
        isAvailable: _isAvailable,
        maxBookingsPerDay: int.tryParse(_maxBookingsCtrl.text.trim()),
        advanceNoticeDays: int.tryParse(_advanceNoticeCtrl.text.trim()),
        pricingTiers: _pricingTiers,
        requirements: _requirementsCtrl.text.trim().isEmpty
            ? null
            : _requirementsCtrl.text.trim(),
        cancellationPolicy: _cancellationPolicyCtrl.text.trim().isEmpty
            ? null
            : _cancellationPolicyCtrl.text.trim(),
      );

      if (_isEdit) {
        await repo.updateService(widget.serviceId!, formData.toJson());
        ref.invalidate(serviceDetailProvider(widget.serviceId!));
      } else {
        await repo.createService(formData);
      }

      ref.invalidate(servicesListProvider);
      if (mounted) {
        unawaited(ref.read(draftServiceProvider).clear(_draftScope));
        HapticFeedback.lightImpact();
        context.pop();
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'No se pudo guardar el servicio. Inténtalo de nuevo.',
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }
}
