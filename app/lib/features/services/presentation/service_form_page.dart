import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../shared/widgets/duration_picker_field.dart';
import '../../../shared/widgets/image_upload_widget.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../data/service_model.dart';
import '../data/services_repository.dart';
import '../providers/services_provider.dart';

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
  final _durationCtrl = TextEditingController();
  final _durationMinutesCtrl = TextEditingController();
  final _maxBookingsCtrl = TextEditingController();
  final _advanceNoticeCtrl = TextEditingController();
  final _requirementsCtrl = TextEditingController();
  final _cancellationPolicyCtrl = TextEditingController();
  final _metaTitleCtrl = TextEditingController();
  final _metaDescCtrl = TextEditingController();
  final _metaKeywordsCtrl = TextEditingController();
  final _imageCtrl = TextEditingController();
  File? _pendingImage;
  String _priceLabel = 'desde';
  String _currency = 'EUR';
  bool _isActive = true;
  bool _isFeatured = false;
  bool _isAvailable = true;
  bool _loading = false;
  bool _populated = false;

  bool get _isEdit => widget.serviceId != null;

  @override
  void dispose() {
    for (final ctrl in [
      _nameCtrl,
      _slugCtrl,
      _descCtrl,
      _shortDescCtrl,
      _priceCtrl,
      _durationCtrl,
      _durationMinutesCtrl,
      _maxBookingsCtrl,
      _advanceNoticeCtrl,
      _requirementsCtrl,
      _cancellationPolicyCtrl,
      _metaTitleCtrl,
      _metaDescCtrl,
      _metaKeywordsCtrl,
      _imageCtrl,
    ]) {
      ctrl.dispose();
    }
    super.dispose();
  }

  void _populateForm(ServiceDetail detail) {
    if (_populated) return;
    _populated = true;
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
    _metaTitleCtrl.text = detail.metaTitle ?? '';
    _metaDescCtrl.text = detail.metaDescription ?? '';
    _metaKeywordsCtrl.text = detail.metaKeywords.join(', ');
    _imageCtrl.text = detail.imageUrl ?? '';
    setState(() {
      _priceLabel = detail.priceLabel ?? 'desde';
      _currency = detail.currency;
      _isActive = detail.isActive;
      _isFeatured = detail.isFeatured;
      _isAvailable = detail.isAvailable;
    });
  }

  void _autoSlug(String name) {
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
      // Subir imagen si se seleccionó una nueva.
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
        isActive: _isActive,
        isFeatured: _isFeatured,
        isAvailable: _isAvailable,
        maxBookingsPerDay: int.tryParse(_maxBookingsCtrl.text.trim()),
        advanceNoticeDays: int.tryParse(_advanceNoticeCtrl.text.trim()),
        requirements: _requirementsCtrl.text.trim().isEmpty
            ? null
            : _requirementsCtrl.text.trim(),
        cancellationPolicy: _cancellationPolicyCtrl.text.trim().isEmpty
            ? null
            : _cancellationPolicyCtrl.text.trim(),
        metaTitle: _metaTitleCtrl.text.trim().isEmpty
            ? null
            : _metaTitleCtrl.text.trim(),
        metaDescription: _metaDescCtrl.text.trim().isEmpty
            ? null
            : _metaDescCtrl.text.trim(),
        metaKeywords: _metaKeywordsCtrl.text.trim().isEmpty
            ? null
            : _metaKeywordsCtrl.text.trim(),
      );

      if (_isEdit) {
        await repo.updateService(widget.serviceId!, formData.toJson());
        ref.invalidate(serviceDetailProvider(widget.serviceId!));
      } else {
        await repo.createService(formData);
      }

      ref.invalidate(servicesListProvider);
      if (mounted) context.pop();
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

  @override
  Widget build(BuildContext context) => _buildContent(context);

  void _rebuild(VoidCallback fn) => setState(fn);
}
