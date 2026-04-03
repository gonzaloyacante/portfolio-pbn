import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
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
    // Usar coverImageUrl si existe; si no, thumbnailUrl como fallback para
    // categorías creadas antes del sistema de imagen dual.
    _coverImageCtrl.text = detail.coverImageUrl ?? detail.thumbnailUrl ?? '';
    setState(() {
      _isActive = detail.isActive;
    });
  }

  void _autoSlug(String name) {
    if (_isEdit) return;
    _slugCtrl.text = _toSlug(name);
  }

  Future<void> _pickFromGallery() async {
    if (!_isEdit) return;
    try {
      final images = await ref
          .read(categoriesRepositoryProvider)
          .getCategoryGallery(widget.categoryId!);
      if (!mounted) return;
      if (images.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No hay imágenes en la galería de esta categoría.'),
          ),
        );
        return;
      }
      await showModalBottomSheet<void>(
        context: context,
        isScrollControlled: true,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        builder: (ctx) {
          return DraggableScrollableSheet(
            expand: false,
            initialChildSize: 0.6,
            maxChildSize: 0.9,
            builder: (_, scrollCtrl) {
              return Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: Row(
                      children: [
                        const Expanded(
                          child: Text(
                            'Seleccionar de la galería',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => ctx.pop(),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),
                  Expanded(
                    child: GridView.builder(
                      controller: scrollCtrl,
                      padding: const EdgeInsets.all(AppSpacing.sm),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            crossAxisSpacing: 6,
                            mainAxisSpacing: 6,
                          ),
                      itemCount: images.length,
                      itemBuilder: (_, i) {
                        final img = images[i];
                        return RepaintBoundary(
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _coverImageCtrl.text = img.url;
                                _pendingThumbnail = null;
                              });
                              ctx.pop();
                            },
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: CachedNetworkImage(
                                imageUrl: img.url,
                                fit: BoxFit.cover,
                                placeholder: (ctx2, url) => const ColoredBox(
                                  color: AppColors.lightBorder,
                                ),
                                errorWidget: (ctx2, url, err) => const Icon(
                                  Icons.broken_image,
                                  color: AppColors.neutralMedium,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              );
            },
          );
        },
      );
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No se pudo cargar la galería. Inténtalo de nuevo.'),
          ),
        );
      }
    }
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
      if (mounted) context.pop();
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
