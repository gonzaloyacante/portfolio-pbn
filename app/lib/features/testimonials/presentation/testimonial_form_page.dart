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

  List<TextEditingController> get _controllers => [
    _nameCtrl,
    _textCtrl,
    _emailCtrl,
    _positionCtrl,
    _companyCtrl,
    _avatarCtrl,
  ];

  @override
  void dispose() {
    for (final ctrl in _controllers) {
      ctrl.dispose();
    }
    super.dispose();
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
