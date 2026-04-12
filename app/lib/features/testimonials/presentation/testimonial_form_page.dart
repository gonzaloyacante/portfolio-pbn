import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'package:intl_phone_field/intl_phone_field.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/validators.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/testimonial_model.dart';
import '../providers/testimonials_provider.dart';
part 'testimonial_form_page_builders.dart';

class TestimonialFormPage extends ConsumerStatefulWidget {
  const TestimonialFormPage({super.key, this.testimonialId});

  final String? testimonialId;

  @override
  ConsumerState<TestimonialFormPage> createState() =>
      _TestimonialFormPageState();
}

class _TestimonialFormPageState extends ConsumerState<TestimonialFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _textCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  String? _completePhone;
  final _positionCtrl = TextEditingController();
  final _companyCtrl = TextEditingController();
  final _avatarCtrl = TextEditingController();
  File? _pendingAvatar;

  int _rating = 5;
  bool _verified = false;
  bool _featured = false;
  bool _isActive = true;
  String _status = 'PENDING';
  bool _loading = false;
  bool _populated = false;

  bool get _isEdit => widget.testimonialId != null;

  @override
  void dispose() {
    for (final ctrl in [
      _nameCtrl,
      _textCtrl,
      _emailCtrl,
      _positionCtrl,
      _companyCtrl,
      _avatarCtrl,
    ]) {
      ctrl.dispose();
    }
    super.dispose();
  }

  void _populateForm(TestimonialDetail d) {
    if (_populated) return;
    _populated = true;
    _nameCtrl.text = d.name;
    _textCtrl.text = d.text;
    _emailCtrl.text = d.email ?? '';
    _completePhone = d.phone;
    _positionCtrl.text = d.position ?? '';
    _companyCtrl.text = d.company ?? '';
    _avatarCtrl.text = d.avatarUrl ?? '';
    setState(() {
      _rating = d.rating;
      _verified = d.verified;
      _featured = d.featured;
      _isActive = d.isActive;
      _status = d.status;
    });
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);

    try {
      // Subir avatar si se seleccionó uno nuevo.
      if (_pendingAvatar != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        final result = await uploadSvc.uploadImageFull(
          _pendingAvatar!,
          folder: 'portfolio/testimonials',
        );
        _avatarCtrl.text = result.url;
      }

      final data = TestimonialFormData(
        name: _nameCtrl.text.trim(),
        text: _textCtrl.text.trim(),
        email: _emailCtrl.text.trim().isEmpty ? null : _emailCtrl.text.trim(),
        phone: (_completePhone?.trim().isEmpty ?? true)
            ? null
            : _completePhone!.trim(),
        position: _positionCtrl.text.trim().isEmpty
            ? null
            : _positionCtrl.text.trim(),
        company: _companyCtrl.text.trim().isEmpty
            ? null
            : _companyCtrl.text.trim(),
        avatarUrl: _avatarCtrl.text.trim().isEmpty
            ? null
            : _avatarCtrl.text.trim(),
        rating: _rating,
        verified: _verified,
        featured: _featured,
        status: _status,
        isActive: _isActive,
      );

      if (_isEdit) {
        await ref
            .read(testimonialsRepositoryProvider)
            .updateTestimonial(widget.testimonialId!, data.toJson());
      } else {
        await ref.read(testimonialsRepositoryProvider).createTestimonial(data);
      }

      ref.invalidate(testimonialsListProvider);
      if (mounted) {
        final msg = _isEdit ? 'Testimonio actualizado' : 'Testimonio creado';
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(msg)));
        context.pop();
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error al guardar: $e')));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget body = _buildBody(context);

    if (_isEdit) {
      final detailAsync = ref.watch(
        testimonialDetailProvider(widget.testimonialId!),
      );
      body = detailAsync.when(
        loading: () =>
            const SkeletonSettingsPage(cardCount: 4, fieldsPerCard: 3),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (detail) {
          _populateForm(detail);
          return body;
        },
      );
    }

    return LoadingOverlay(
      isLoading: _loading,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
            tooltip: 'Volver',
          ),
          title: Text(_isEdit ? 'Editar testimonio' : 'Nuevo testimonio'),
        ),
        body: body,
      ),
    );
  }
}
