import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'package:intl_phone_field/intl_phone_field.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/draft_service.dart';
import '../../../core/utils/validators.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/testimonial_model.dart';
import '../providers/testimonials_provider.dart';

part 'testimonial_form_page_builders.dart';
part 'testimonial_form_page_draft.dart';

class TestimonialFormPage extends ConsumerStatefulWidget {
  const TestimonialFormPage({super.key, this.testimonialId});

  final String? testimonialId;

  @override
  ConsumerState<TestimonialFormPage> createState() =>
      _TestimonialFormPageState();
}

class _TestimonialFormPageState extends ConsumerState<TestimonialFormPage>
    with WidgetsBindingObserver {
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
  bool _isDirty = false;
  bool _hasDraft = false;

  bool get _isEdit => widget.testimonialId != null;

  String get _draftScope =>
      _isEdit ? 'testimonial_edit__${widget.testimonialId}' : 'testimonial_new';

  List<TextEditingController> get _controllers => [
    _nameCtrl,
    _textCtrl,
    _emailCtrl,
    _positionCtrl,
    _companyCtrl,
    _avatarCtrl,
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    checkDraft();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive) {
      saveDraftToDisk();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    for (final ctrl in _controllers) {
      ctrl.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    late final Widget body;

    if (_isEdit) {
      final tid = widget.testimonialId!;
      ref.listen<AsyncValue<TestimonialDetail>>(
        testimonialDetailProvider(tid),
        (_, next) {
          next.whenData((detail) {
            if (!mounted || _populated || _isDirty) {
              return;
            }
            _populateForm(detail);
            _populated = true;
          });
        },
      );
      final detailAsync = ref.watch(testimonialDetailProvider(tid));
      body = detailAsync.when(
        loading: () =>
            const SkeletonSettingsPage(cardCount: 4, fieldsPerCard: 3),
        error: (e, _) => Center(
          child: ErrorState.forFailure(
            e,
            fallbackMessage: 'No se pudo cargar el testimonio',
            onRetry: () => ref.invalidate(testimonialDetailProvider(tid)),
          ),
        ),
        data: (_) => _buildBody(context),
      );
    } else {
      body = _buildBody(context);
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
