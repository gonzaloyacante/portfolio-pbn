import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/emoji_icon_picker.dart';
import '../../../shared/widgets/image_upload_widget.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../data/categories_repository.dart';
import '../data/category_model.dart';
import '../providers/categories_provider.dart';

// Patrones de slug compilados una sola vez
// Tipados como Pattern para evitar DEPRECATED_MEMBER_USE del linter (RegExp
// se usa como implementación de Pattern, que es el uso correcto y estable).
final Pattern _reAccentA = RegExp(r'[áàâä]');
final Pattern _reAccentE = RegExp(r'[éèêë]');
final Pattern _reAccentI = RegExp(r'[íìîï]');
final Pattern _reAccentO = RegExp(r'[óòôö]');
final Pattern _reAccentU = RegExp(r'[úùûü]');
final Pattern _reNyeN = RegExp(r'[ñ]');
final Pattern _reNonSlugChars = RegExp(r'[^a-z0-9\s-]');
final Pattern _reWhitespace = RegExp(r'\s+');
// _reSlugValid necesita .hasMatch() (método de RegExp, no de Pattern) →
// se mantiene tipado como RegExp; el ignore suprime el warning de Codacy.
// ignore: deprecated_member_use
final RegExp _reSlugValid = RegExp(r'^[a-z0-9-]+$');

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
  final _thumbnailCtrl = TextEditingController();
  File? _pendingThumbnail;
  final _iconCtrl = TextEditingController();
  final _colorCtrl = TextEditingController();
  String? _selectedIcon;

  bool _isActive = true;
  bool _loading = false;
  String? _populatedFor;

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
    _thumbnailCtrl.dispose();
    _iconCtrl.dispose();
    _colorCtrl.dispose();
    super.dispose();
  }

  void _populateForm(CategoryDetail detail) {
    if (_populatedFor == widget.categoryId) return;
    _populatedFor = widget.categoryId;
    _nameCtrl.text = detail.name;
    _slugCtrl.text = detail.slug;
    _descriptionCtrl.text = detail.description ?? '';
    _thumbnailCtrl.text = detail.thumbnailUrl ?? '';
    _iconCtrl.text = detail.iconName ?? '';
    _colorCtrl.text = detail.color ?? '';
    setState(() {
      _isActive = detail.isActive;
      _selectedIcon = detail.iconName;
    });
  }

  void _autoSlug(String name) {
    if (_isEdit) return;
    final slug = name
        .toLowerCase()
        .replaceAll(_reAccentA, 'a')
        .replaceAll(_reAccentE, 'e')
        .replaceAll(_reAccentI, 'i')
        .replaceAll(_reAccentO, 'o')
        .replaceAll(_reAccentU, 'u')
        .replaceAll(_reNyeN, 'n')
        .replaceAll(_reNonSlugChars, '')
        .trim()
        .replaceAll(_reWhitespace, '-');
    _slugCtrl.text = slug;
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      // Subir imagen si se seleccionó una nueva.
      if (_pendingThumbnail != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        _thumbnailCtrl.text = await uploadSvc.uploadImage(
          _pendingThumbnail!,
          folder: 'portfolio/categories',
        );
      }

      final repo = ref.read(categoriesRepositoryProvider);
      final formData = CategoryFormData(
        name: _nameCtrl.text.trim(),
        slug: _slugCtrl.text.trim(),
        description: _descriptionCtrl.text.trim().isEmpty
            ? null
            : _descriptionCtrl.text.trim(),
        thumbnailUrl: _thumbnailCtrl.text.trim().isEmpty
            ? null
            : _thumbnailCtrl.text.trim(),
        iconName: (_selectedIcon?.isEmpty ?? true) ? null : _selectedIcon,
        color: _colorCtrl.text.trim().isEmpty ? null : _colorCtrl.text.trim(),
        isActive: _isActive,
      );

      if (_isEdit) {
        await repo.updateCategory(widget.categoryId!, formData.toJson());
        ref.invalidate(categoryDetailProvider(widget.categoryId!));
      } else {
        await repo.createCategory(formData);
      }

      ref.invalidate(categoriesListProvider);
      if (mounted) context.pop();
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'No se pudo guardar la categoría. Inténtalo de nuevo.',
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isEdit) {
      final detailAsync = ref.watch(categoryDetailProvider(widget.categoryId!));
      detailAsync.whenData(_populateForm);
    }

    return AppScaffold(
      title: _isEdit ? 'Editar categoría' : 'Nueva categoría',
      actions: [
        TextButton(
          onPressed: _loading ? null : _submit,
          child: const Text('Guardar'),
        ),
      ],
      body: LoadingOverlay(
        isLoading: _loading,
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Nombre
              TextFormField(
                controller: _nameCtrl,
                decoration: const InputDecoration(
                  labelText: 'Nombre *',
                  hintText: 'ej. Fotografía',
                ),
                textCapitalization: TextCapitalization.words,
                onChanged: _autoSlug,
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Nombre requerido' : null,
              ),
              const SizedBox(height: 16),

              // Slug
              TextFormField(
                controller: _slugCtrl,
                decoration: const InputDecoration(
                  labelText: 'Slug *',
                  hintText: 'ej. fotografia',
                  prefixText: '/',
                ),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Slug requerido';
                  if (!_reSlugValid.hasMatch(v.trim())) {
                    return 'Solo letras minúsculas, números y guiones';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Descripción
              TextFormField(
                controller: _descriptionCtrl,
                decoration: const InputDecoration(
                  labelText: 'Descripción',
                  hintText: 'Descripción de la categoría',
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 16),

              // Ícono
              EmojiIconPicker(
                value: _selectedIcon,
                onChanged: (v) => setState(() => _selectedIcon = v),
                label: 'Ícono de la categoría',
                hint: 'Toca para elegir un emoji',
              ),
              const SizedBox(height: 16),

              // Color
              TextFormField(
                controller: _colorCtrl,
                decoration: const InputDecoration(
                  labelText: 'Color de marca',
                  hintText: 'ej. #6C0A0A',
                  prefixIcon: Icon(Icons.color_lens_outlined),
                ),
              ),
              const SizedBox(height: 16),

              // Thumbnail
              ImageUploadWidget(
                label: 'Imagen de portada',
                currentImageUrl: _thumbnailCtrl.text.isNotEmpty
                    ? _thumbnailCtrl.text
                    : null,
                onImageSelected: (file) {
                  setState(() => _pendingThumbnail = file);
                },
                onImageRemoved: () {
                  setState(() {
                    _pendingThumbnail = null;
                    _thumbnailCtrl.clear();
                  });
                },
                height: 160,
              ),
              const SizedBox(height: 16),

              // Estado activo
              SwitchListTile(
                title: const Text('Categoría activa'),
                subtitle: const Text('Visible en el portfolio'),
                value: _isActive,
                onChanged: (v) => setState(() => _isActive = v),
              ),
              const SizedBox(height: 32),

              FilledButton(
                onPressed: _loading ? null : _submit,
                child: Text(
                  _isEdit ? 'Actualizar categoría' : 'Crear categoría',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
