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
    _checkDraft();
  }

  Future<void> _checkDraft() async {
    final has = await ref.read(draftServiceProvider).hasDraft(_draftScope);
    if (mounted && has) setState(() => _hasDraft = true);
  }

  Future<void> _restoreDraft() async {
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

  Future<void> _discardDraft() async {
    await ref.read(draftServiceProvider).clear(_draftScope);
    if (mounted) setState(() => _hasDraft = false);
  }

  Future<void> _saveDraft() async {
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

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive) {
      _saveDraft();
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
