import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/router/route_names.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/utils/draft_service.dart';
import '../data/categories_repository.dart';
import '../data/category_model.dart';
import '../providers/categories_provider.dart';

part 'category_form_page_builders.dart';

class CategoryFormPage extends ConsumerStatefulWidget {
  const CategoryFormPage({super.key, this.categoryId});

  final String? categoryId;

  @override
  ConsumerState<CategoryFormPage> createState() => _CategoryFormPageState();
}

class _CategoryFormPageState extends ConsumerState<CategoryFormPage>
    with WidgetsBindingObserver {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _slugCtrl = TextEditingController();
  final _descriptionCtrl = TextEditingController();
  final _coverImageCtrl = TextEditingController();
  final _imageSlotKey = GlobalKey();
  double? _calculatedImageHeight;
  File? _pendingThumbnail;

  bool _isActive = true;
  bool _loading = false;
  String? _populatedFor;
  bool _isDirty = false;
  bool _hasDraft = false;

  bool get _isEdit => widget.categoryId != null;

  String get _draftScope =>
      _isEdit ? 'category_edit__${widget.categoryId}' : 'category_new';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _checkDraft();
  }

  Future<void> _checkDraft() async {
    final draft = await ref.read(draftServiceProvider).hasDraft(_draftScope);
    if (mounted && draft) setState(() => _hasDraft = true);
  }

  Future<void> _restoreDraft() async {
    final data = await ref.read(draftServiceProvider).load(_draftScope);
    if (data == null || !mounted) return;
    setState(() {
      _nameCtrl.text = data['name'] as String? ?? '';
      _slugCtrl.text = data['slug'] as String? ?? '';
      _descriptionCtrl.text = data['description'] as String? ?? '';
      _coverImageCtrl.text = data['coverImageUrl'] as String? ?? '';
      _isActive = data['isActive'] as bool? ?? true;
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
      'slug': _slugCtrl.text,
      'description': _descriptionCtrl.text,
      'coverImageUrl': _coverImageCtrl.text,
      'isActive': _isActive,
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
  void didUpdateWidget(covariant CategoryFormPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.categoryId != widget.categoryId) {
      _populatedFor = null;
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _nameCtrl.dispose();
    _slugCtrl.dispose();
    _descriptionCtrl.dispose();
    _coverImageCtrl.dispose();
    super.dispose();
  }

  void _markDirty() {
    if (!_isDirty) _rebuild(() => _isDirty = true);
  }

  @override
  Widget build(BuildContext context) => _buildContent(context);

  void _rebuild(VoidCallback fn) => setState(fn);
}
