import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/image_upload_widget.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../data/categories_repository.dart';
import '../data/category_model.dart';
import '../providers/categories_provider.dart';

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
            content: Text(
              'No hay imágenes en la galería de proyectos de esta categoría.',
            ),
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
                          onPressed: () => Navigator.of(ctx).pop(),
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
                              Navigator.of(ctx).pop();
                            },
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: CachedNetworkImage(
                                imageUrl: img.thumbnailUrl,
                                fit: BoxFit.cover,
                                placeholder: (ctx2, url) =>
                                    const ColoredBox(color: Color(0xFFE5E5E5)),
                                errorWidget: (ctx2, url, err) => const Icon(
                                  Icons.broken_image,
                                  color: Color(0xFF9E9E9E),
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

    final media = MediaQuery.of(context);
    const appBarApprox = 100.0;
    final fallbackHeight =
        (media.size.height -
                media.padding.top -
                media.padding.bottom -
                appBarApprox)
            .clamp(200.0, 1200.0);
    final imageHeight = _calculatedImageHeight ?? fallbackHeight;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final ctx = _imageSlotKey.currentContext;
      if (ctx == null) return;
      final box = ctx.findRenderObject() as RenderBox?;
      if (box == null || !box.attached) return;
      final dy = box.localToGlobal(Offset.zero).dy;
      final usable =
          media.size.height - media.padding.bottom - dy - appBarApprox;
      final newH = usable.clamp(200.0, 1200.0);
      if ((_calculatedImageHeight == null) ||
          ((_calculatedImageHeight! - newH).abs() > 1.0)) {
        setState(() => _calculatedImageHeight = newH);
      }
    });

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
              // Nombre + Switch + Descripción (responsivo)
              Builder(
                builder: (ctx) {
                  final colorScheme = Theme.of(ctx).colorScheme;
                  final isTablet = media.size.width >= 600;

                  final nameField = TextFormField(
                    controller: _nameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Nombre *',
                      hintText: 'ej. Fotografía',
                      helperText: 'Nombre público de la categoría',
                    ),
                    textCapitalization: TextCapitalization.words,
                    onChanged: _autoSlug,
                    validator: (v) => (v == null || v.trim().isEmpty)
                        ? 'Nombre requerido'
                        : null,
                  );

                  final switchTile = Container(
                    decoration: BoxDecoration(
                      color: colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: colorScheme.outline.withValues(alpha: 0.3),
                      ),
                    ),
                    child: SwitchListTile(
                      title: const Text('Categoría activa'),
                      subtitle: const Text('Visible en el portfolio'),
                      value: _isActive,
                      onChanged: (v) => setState(() => _isActive = v),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12,
                      ),
                      visualDensity: VisualDensity.compact,
                      controlAffinity: ListTileControlAffinity.trailing,
                    ),
                  );

                  if (isTablet) {
                    return IntrinsicHeight(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                nameField,
                                const SizedBox(height: 8),
                                switchTile,
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: _descriptionCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Descripción',
                                hintText: 'Breve descripción de esta categoría',
                                helperText:
                                    'Se muestra en la página de la categoría',
                              ),
                              maxLines: null,
                              expands: true,
                            ),
                          ),
                        ],
                      ),
                    );
                  }

                  // Mobile: apilado
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      nameField,
                      const SizedBox(height: 8),
                      switchTile,
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _descriptionCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Descripción',
                          hintText: 'Breve descripción de esta categoría',
                          helperText: 'Se muestra en la página de la categoría',
                        ),
                        maxLines: 3,
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 16),

              // Thumbnail
              // Wrapper con key para medir su posición en pantalla
              Container(
                key: _imageSlotKey,
                child: ImageUploadWidget(
                  label: 'Imagen de portada',
                  currentImageUrl: _coverImageCtrl.text.isNotEmpty
                      ? _coverImageCtrl.text
                      : null,
                  onImageSelected: (file) {
                    setState(() => _pendingThumbnail = file);
                  },
                  onImageRemoved: () {
                    setState(() {
                      _pendingThumbnail = null;
                      _coverImageCtrl.clear();
                    });
                  },
                  height: imageHeight,
                ),
              ),

              if (_isEdit) ...[
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  icon: const Icon(Icons.photo_library_outlined, size: 18),
                  label: const Text('Seleccionar de la galería'),
                  onPressed: _loading ? null : _pickFromGallery,
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 44),
                  ),
                ),
              ],

              const SizedBox(height: 24),

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
