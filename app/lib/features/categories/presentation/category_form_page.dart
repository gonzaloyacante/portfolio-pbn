import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
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
import '../data/categories_repository.dart';
import '../data/category_model.dart';
import '../providers/categories_provider.dart';

part 'category_form_page_builders.dart';
// ── Slug helpers ──────────────────────────────────────────────────────────────

/// Convierte un nombre legible en un slug URL-safe sin dependencias de RegExp
/// a nivel de módulo (evita DEPRECATED_MEMBER_USE de dartanalyzer).
String _toSlug(String input) {
  // Mapa de reemplazos de acentos → ascii
  const accents = <String, String>{
    'á': 'a',
    'à': 'a',
    'â': 'a',
    'ä': 'a',
    'é': 'e',
    'è': 'e',
    'ê': 'e',
    'ë': 'e',
    'í': 'i',
    'ì': 'i',
    'î': 'i',
    'ï': 'i',
    'ó': 'o',
    'ò': 'o',
    'ô': 'o',
    'ö': 'o',
    'ú': 'u',
    'ù': 'u',
    'û': 'u',
    'ü': 'u',
    'ñ': 'n',
  };
  var s = input.toLowerCase();
  for (final entry in accents.entries) {
    s = s.replaceAll(entry.key, entry.value);
  }
  // Remover no-slug, normalizar espacios → guión
  // ignore: deprecated_member_use
  s = s.replaceAll(RegExp(r'[^a-z0-9\s-]'), '').trim();
  // ignore: deprecated_member_use
  return s.replaceAll(RegExp(r'\s+'), '-');
}

class CategoryFormPage extends ConsumerStatefulWidget {
  const CategoryFormPage({super.key, this.categoryId});

  final String? categoryId;

  @override
  ConsumerState<CategoryFormPage> createState() => _CategoryFormPageState();
}

class _CategoryFormPageState extends ConsumerState<CategoryFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _slugCtrl = TextEditingController();
  final _descriptionCtrl = TextEditingController();
  final _coverImageCtrl = TextEditingController();
  // Key para medir la posición del widget de imagen y calcular altura restante
  final _imageSlotKey = GlobalKey();
  double? _calculatedImageHeight;
  File? _pendingThumbnail;

  bool _isActive = true;
  bool _loading = false;
  String? _populatedFor;
  bool _isDirty = false;

  bool get _isEdit => widget.categoryId != null;

  @override
  void didUpdateWidget(covariant CategoryFormPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.categoryId != widget.categoryId) {
      _populatedFor = null;
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _slugCtrl.dispose();
    _descriptionCtrl.dispose();
    _coverImageCtrl.dispose();
    super.dispose();
  }

  void _populateForm(CategoryDetail detail) {
    if (_populatedFor == widget.categoryId) return;
    _populatedFor = widget.categoryId;
    _nameCtrl.text = detail.name;
    _slugCtrl.text = detail.slug;
    _descriptionCtrl.text = detail.description ?? '';
    _coverImageCtrl.text = detail.coverImageUrl ?? '';
    setState(() {
      _isActive = detail.isActive;
    });
  }

  void _markDirty() {
    if (!_isDirty) _rebuild(() => _isDirty = true);
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
    _slugCtrl.text = _toSlug(name);
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      // Subir imagen si se seleccionó una nueva.
      if (_pendingThumbnail != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        final result = await uploadSvc.uploadImageFull(
          _pendingThumbnail!,
          folder: 'portfolio/categories',
        );
        _coverImageCtrl.text = result.url;
      }

      final repo = ref.read(categoriesRepositoryProvider);
      final formData = CategoryFormData(
        name: _nameCtrl.text.trim(),
        slug: _slugCtrl.text.trim(),
        description: _descriptionCtrl.text.trim().isEmpty
            ? null
            : _descriptionCtrl.text.trim(),
        coverImageUrl: _coverImageCtrl.text.trim().isEmpty
            ? null
            : _coverImageCtrl.text.trim(),
        isActive: _isActive,
      );

      if (_isEdit) {
        await repo.updateCategory(widget.categoryId!, formData.toJson());
        ref.invalidate(categoryDetailProvider(widget.categoryId!));
      } else {
        await repo.createCategory(formData);
      }

      ref.invalidate(categoriesListProvider);
      if (mounted) {
        HapticFeedback.lightImpact();
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
  Widget build(BuildContext context) => _buildContent(context);

  void _rebuild(VoidCallback fn) => setState(fn);
}
