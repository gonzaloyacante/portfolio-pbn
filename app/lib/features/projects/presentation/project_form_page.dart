import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/utils/app_logger.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../categories/providers/categories_provider.dart';
import '../data/project_model.dart';
import '../data/projects_repository.dart';
import '../providers/projects_provider.dart';

// Patrones de slug compilados una sola vez (igual que category_form_page)
// Tipados como Pattern para evitar DEPRECATED_MEMBER_USE del linter (RegExp
// se usa como implementación de Pattern, que es el uso correcto y estable).
final Pattern _reProjAccentA = RegExp(r'[áàâä]');
final Pattern _reProjAccentE = RegExp(r'[éèêë]');
final Pattern _reProjAccentI = RegExp(r'[íìîï]');
final Pattern _reProjAccentO = RegExp(r'[óòôö]');
final Pattern _reProjAccentU = RegExp(r'[úùûü]');
final Pattern _reProjNyeN = RegExp(r'[ñ]');
final Pattern _reProjNonSlug = RegExp(r'[^a-z0-9\s-]');
final Pattern _reProjWhitespace = RegExp(r'\s+');

// ── ProjectFormPage ───────────────────────────────────────────────────────────

/// Formulario de creación/edición de proyecto.
///
/// - Modo creación: [projectId] = null
/// - Modo edición: [projectId] = id del proyecto a editar
class ProjectFormPage extends ConsumerStatefulWidget {
  const ProjectFormPage({super.key, this.projectId});

  final String? projectId;

  bool get isEditing => projectId != null;

  @override
  ConsumerState<ProjectFormPage> createState() => _ProjectFormPageState();
}

class _ProjectFormPageState extends ConsumerState<ProjectFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _data = ProjectFormData();
  bool _isLoading = false;
  String? _errorMsg;
  int? _pendingCoverIndex;

  // Galería de imágenes
  List<ProjectImage> _existingImages = [];

  @override
  void initState() {
    super.initState();
    // Para proyectos nuevos, la fecha por defecto es hoy
    if (!widget.isEditing) {
      _data.date = DateTime.now();
    }
  }

  final List<File> _pendingNewImages = [];
  final Set<String> _removedImageIds = {};

  /// Imágenes pre-subidas (antes de crear el proyecto) guardadas como mapas
  /// {'url': url, 'publicId': publicId}
  final List<Map<String, String>> _preuploadedImages = [];

  @override
  Widget build(BuildContext context) {
    if (widget.isEditing) {
      final detailAsync = ref.watch(projectDetailProvider(widget.projectId!));
      return detailAsync.when(
        loading: () => Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.pop(),
              tooltip: 'Volver',
            ),
            title: const Text('Editar proyecto'),
            actions: [
              IconButton(
                tooltip: 'Reintentar',
                icon: const Icon(Icons.refresh_rounded),
                onPressed: () =>
                    ref.invalidate(projectDetailProvider(widget.projectId!)),
              ),
            ],
          ),
          body: Column(
            children: [
              const SizedBox(height: 16),
              const Expanded(
                child: SkeletonSettingsPage(cardCount: 2, fieldsPerCard: 4),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: TextButton.icon(
                  onPressed: () =>
                      ref.invalidate(projectDetailProvider(widget.projectId!)),
                  icon: const Icon(Icons.refresh_rounded),
                  label: const Text('Reintentar'),
                ),
              ),
            ],
          ),
        ),
        error: (err, _) => Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.pop(),
              tooltip: 'Volver',
            ),
            title: const Text('Error'),
            actions: [
              IconButton(
                tooltip: 'Reintentar',
                icon: const Icon(Icons.refresh_rounded),
                onPressed: () =>
                    ref.invalidate(projectDetailProvider(widget.projectId!)),
              ),
            ],
          ),
          body: ErrorState(
            message: err.toString(),
            onRetry: () =>
                ref.invalidate(projectDetailProvider(widget.projectId!)),
          ),
        ),
        data: (project) {
          _populateForm(project);
          return _buildForm(context);
        },
      );
    }
    return _buildForm(context);
  }

  void _populateForm(ProjectDetail project) {
    if (_data.title.isEmpty) {
      _data.title = project.title;
      _data.slug = project.slug;
      _data.description = project.description;
      _data.excerpt = project.excerpt;
      _data.thumbnailUrl = project.thumbnailUrl ?? '';
      _data.videoUrl = project.videoUrl;
      _data.date = DateTime.tryParse(project.date);
      _data.duration = project.duration;
      _data.client = project.client;
      _data.location = project.location;
      _data.tags = List.from(project.tags);
      _data.metaTitle = project.metaTitle;
      _data.metaDescription = project.metaDescription;
      _data.categoryId = project.categoryId;
      _data.isFeatured = project.isFeatured;
      _data.isPinned = project.isPinned;
      _data.isActive = project.isActive;
      // Cargar galería existente (solo una vez)
      _existingImages = project.images.toList();
    }
  }

  void _autoSlug(String title) {
    if (widget.isEditing) return;
    _data.slug = title
        .toLowerCase()
        .replaceAll(_reProjAccentA, 'a')
        .replaceAll(_reProjAccentE, 'e')
        .replaceAll(_reProjAccentI, 'i')
        .replaceAll(_reProjAccentO, 'o')
        .replaceAll(_reProjAccentU, 'u')
        .replaceAll(_reProjNyeN, 'n')
        .replaceAll(_reProjNonSlug, '')
        .trim()
        .replaceAll(_reProjWhitespace, '-');
  }

  Future<void> _pickGalleryImage() async {
    try {
      final picker = ImagePicker();
      // imageQuality is intentionally omitted: the upload service compresses
      // before sending to Cloudinary, and omitting it avoids native crashes
      // on HEIC / cloud-backed gallery photos on Android 13+.
      final picked = await picker.pickImage(source: ImageSource.gallery);
      if (picked == null) return;
      setState(() => _pendingNewImages.add(File(picked.path)));
    } catch (e) {
      AppLogger.error('ProjectFormPage: error picking gallery image', e);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudo seleccionar la imagen')),
        );
      }
    }
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    _formKey.currentState!.save();
    FocusScope.of(context).unfocus();

    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    try {
      // 1. Si el usuario seleccionó una imagen de la galería como miniatura
      // (pendiente), subimos esa imagen primero para obtener url + publicId
      // y setear `thumbnailUrl` antes de crear/actualizar el proyecto.
      final uploadSvc = ref.read(uploadServiceProvider);
      if (_pendingCoverIndex != null) {
        // Si la miniatura escogida es una imagen nueva pendiente
        if (_pendingCoverIndex! < _pendingNewImages.length) {
          final file = _pendingNewImages.removeAt(_pendingCoverIndex!);
          final result = await uploadSvc.uploadImageFull(
            file,
            folder: 'portfolio/projects/gallery',
          );
          _data.thumbnailUrl = result.url;
          _preuploadedImages.add({
            'url': result.url,
            'publicId': result.publicId,
          });
        } else {
          // Si la miniatura escogida es una imagen ya existente, ya debe
          // existir en _existingImages; cubrimos ese caso abajo antes del
          // update/create si es necesario.
        }
      }

      final repo = ref.read(projectsRepositoryProvider);
      String projectId;

      if (widget.isEditing) {
        final updated = await repo.updateProject(
          widget.projectId!,
          _data.toJson(),
        );
        projectId = updated.id;
        ref.invalidate(projectDetailProvider(widget.projectId!));
      } else {
        final created = await repo.createProject(_data);
        projectId = created.id;
      }

      // 2. Eliminar imágenes marcadas para eliminar.
      for (final imageId in _removedImageIds) {
        await repo.removeProjectImage(projectId, imageId);
      }

      // 3. Añadir a la galería las imágenes ya pre-subidas (si las hay)
      for (int i = 0; i < _preuploadedImages.length; i++) {
        final img = _preuploadedImages[i];
        await repo.addProjectImage(
          projectId,
          url: img['url']!,
          publicId: img['publicId']!,
          order: _existingImages.length + i,
        );
      }

      // 4. Subir e indexar las nuevas imágenes restantes de la galería.
      if (_pendingNewImages.isNotEmpty) {
        for (int i = 0; i < _pendingNewImages.length; i++) {
          final result = await uploadSvc.uploadImageFull(
            _pendingNewImages[i],
            folder: 'portfolio/projects/gallery',
          );
          await repo.addProjectImage(
            projectId,
            url: result.url,
            publicId: result.publicId,
            order: _existingImages.length + _preuploadedImages.length + i,
          );
        }
      }

      ref.invalidate(projectsListProvider);
      if (mounted) context.pop();
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      setState(
        () => _errorMsg = 'No se pudo guardar el proyecto. Inténtalo de nuevo.',
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _confirmAndDelete() async {
    if (!widget.isEditing || widget.projectId == null) return;
    final confirmed = await ConfirmDialog.show(
      context,
      title: 'Eliminar proyecto',
      message: '¿Eliminar "${_data.title}"? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      isDestructive: true,
      icon: Icons.delete_forever_outlined,
    );
    if (!confirmed) return;

    setState(() {
      _isLoading = true;
      _errorMsg = null;
    });

    try {
      await ref
          .read(projectsRepositoryProvider)
          .deleteProject(widget.projectId!);
      ref.invalidate(projectsListProvider);
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('"${_data.title}" eliminado')));
      context.pop();
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        setState(() => _errorMsg = 'No se pudo eliminar el proyecto.');
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Widget _buildForm(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
            tooltip: 'Volver',
          ),
          title: Text(widget.isEditing ? 'Editar proyecto' : 'Nuevo proyecto'),
          actions: [
            if (widget.isEditing)
              IconButton(
                tooltip: 'Eliminar',
                icon: const Icon(Icons.delete_outline),
                onPressed: _isLoading ? null : _confirmAndDelete,
              ),
            TextButton.icon(
              onPressed: _isLoading ? null : _submit,
              icon: const Icon(Icons.check_rounded),
              label: Text(widget.isEditing ? 'Guardar' : 'Crear'),
            ),
          ],
        ),
        body: LayoutBuilder(
          builder: (context, constraints) {
            final isTablet = constraints.maxWidth >= 700;
            return Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 16,
                ),
                child: isTablet
                    ? _buildTabletLayout(context)
                    : _buildPhoneLayout(context),
              ),
            );
          },
        ),
      ),
    );
  }

  // ── Layouts ──────────────────────────────────────────────────────────────

  Widget _buildPhoneLayout(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_errorMsg != null) ...[
          _InlineError(message: _errorMsg!),
          const SizedBox(height: 16),
        ],
        _gallerySection(),
        const SizedBox(height: 20),
        _titleField(),
        const SizedBox(height: 12),
        _categoryField(),
        const SizedBox(height: 12),
        _descriptionField(),
        const SizedBox(height: 12),
        _excerptField(),
        const SizedBox(height: 12),
        _clientDurationRow(),
        const SizedBox(height: 12),
        _dateField(),
        const SizedBox(height: 16),
        _featuredPinnedRow(),
        const SizedBox(height: 20),
        _gallerySection(),
        const SizedBox(height: 24),
        _submitButton(),
      ],
    );
  }

  Widget _buildTabletLayout(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_errorMsg != null) ...[
          _InlineError(message: _errorMsg!),
          const SizedBox(height: 16),
        ],
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _descriptionField(),
                  const SizedBox(height: 12),
                  _excerptField(),
                ],
              ),
            ),
            const SizedBox(width: 24),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _titleField(),
                  const SizedBox(height: 12),
                  _categoryField(),
                  const SizedBox(height: 12),
                  _clientDurationRow(),
                  const SizedBox(height: 12),
                  _dateField(),
                  const SizedBox(height: 16),
                  _featuredPinnedRow(),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        _gallerySection(),
        const SizedBox(height: 24),
        _submitButton(),
      ],
    );
  }

  // ── Campos individuales ───────────────────────────────────────────────────

  // Nota: el campo de portada grande fue eliminado en favor de la galería.

  Widget _titleField() => TextFormField(
    initialValue: _data.title,
    decoration: const InputDecoration(
      labelText: 'Título *',
      helperText: 'Nombre del proyecto en el portfolio',
    ),
    textInputAction: TextInputAction.next,
    onChanged: _autoSlug,
    onSaved: (v) => _data.title = v?.trim() ?? '',
    validator: (v) =>
        (v == null || v.trim().isEmpty) ? 'El título es requerido' : null,
  );

  Widget _descriptionField() => TextFormField(
    initialValue: _data.description,
    maxLines: 5,
    decoration: const InputDecoration(
      labelText: 'Descripción *',
      alignLabelWithHint: true,
      helperText: 'Texto completo visible en la página del proyecto',
    ),
    onSaved: (v) => _data.description = v?.trim() ?? '',
    validator: (v) =>
        (v == null || v.trim().isEmpty) ? 'La descripción es requerida' : null,
  );

  Widget _excerptField() => TextFormField(
    initialValue: _data.excerpt,
    maxLines: 2,
    decoration: const InputDecoration(
      labelText: 'Extracto (opcional)',
      alignLabelWithHint: true,
      helperText: 'Resumen corto para listados y tarjetas',
    ),
    onSaved: (v) =>
        _data.excerpt = (v?.trim().isEmpty ?? true) ? null : v!.trim(),
  );

  Widget _clientDurationRow() => Row(
    children: [
      Expanded(
        child: TextFormField(
          initialValue: _data.client,
          decoration: const InputDecoration(labelText: 'Cliente'),
          textInputAction: TextInputAction.next,
          onSaved: (v) =>
              _data.client = (v?.trim().isEmpty ?? true) ? null : v!.trim(),
        ),
      ),
      const SizedBox(width: 12),
      Expanded(
        child: TextFormField(
          initialValue: _data.duration,
          decoration: const InputDecoration(
            labelText: 'Duración',
            hintText: '2 semanas',
          ),
          textInputAction: TextInputAction.next,
          onSaved: (v) =>
              _data.duration = (v?.trim().isEmpty ?? true) ? null : v!.trim(),
        ),
      ),
    ],
  );

  Widget _dateField() => Builder(
    builder: (context) {
      final d = _data.date ?? DateTime.now();
      final label =
          '${d.day.toString().padLeft(2, '0')} / ${d.month.toString().padLeft(2, '0')} / ${d.year}';
      return InkWell(
        onTap: () async {
          final picked = await showDatePicker(
            context: context,
            initialDate: _data.date ?? DateTime.now(),
            firstDate: DateTime(2000),
            lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
          );
          if (picked != null) setState(() => _data.date = picked);
        },
        borderRadius: BorderRadius.circular(4),
        child: InputDecorator(
          decoration: const InputDecoration(
            labelText: 'Fecha del proyecto',
            helperText: 'Fecha en que se realizó el trabajo',
            suffixIcon: Icon(Icons.calendar_today_outlined, size: 20),
          ),
          child: Text(label),
        ),
      );
    },
  );

  Widget _categoryField() {
    final categoriesAsync = ref.watch(categoriesListProvider());
    return categoriesAsync.when(
      loading: () => const LinearProgressIndicator(),
      error: (err, _) => const Text('Error cargando categorías'),
      data: (paginated) {
        final categories = paginated.data;
        if (categories.isEmpty) {
          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Theme.of(
                context,
              ).colorScheme.errorContainer.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: Theme.of(
                  context,
                ).colorScheme.error.withValues(alpha: 0.5),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.warning_amber_rounded,
                  color: Theme.of(context).colorScheme.error,
                  size: 20,
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'No hay categorías disponibles. Crea una en la sección de Categorías antes de crear un proyecto.',
                    style: TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
          );
        }
        return DropdownButtonFormField<String>(
          value:
              _data.categoryId.isNotEmpty &&
                  categories.any((c) => c.id == _data.categoryId)
              ? _data.categoryId
              : null,
          decoration: const InputDecoration(
            labelText: 'Categoría *',
            helperText: 'Categoría principal del proyecto',
          ),
          items: categories.map((c) {
            return DropdownMenuItem(
              value: c.id,
              child: Text(c.name, overflow: TextOverflow.ellipsis),
            );
          }).toList(),
          onChanged: (v) => setState(() => _data.categoryId = v ?? ''),
          onSaved: (v) => _data.categoryId = v ?? '',
          validator: (v) =>
              (v == null || v.isEmpty) ? 'Selecciona una categoría' : null,
        );
      },
    );
  }

  Widget _featuredPinnedRow() => Column(
    children: [
      SwitchListTile(
        title: const Text('Destacado'),
        subtitle: const Text('Aparece en galería principal'),
        value: _data.isFeatured,
        onChanged: (v) => setState(() => _data.isFeatured = v),
        contentPadding: EdgeInsets.zero,
      ),
      SwitchListTile(
        title: const Text('Fijado'),
        subtitle: const Text('Siempre al inicio'),
        value: _data.isPinned,
        onChanged: (v) => setState(() => _data.isPinned = v),
        contentPadding: EdgeInsets.zero,
      ),
      SwitchListTile(
        title: const Text('Activo'),
        subtitle: const Text('Visibilidad pública del proyecto'),
        value: _data.isActive,
        onChanged: (v) => setState(() => _data.isActive = v),
        contentPadding: EdgeInsets.zero,
      ),
    ],
  );

  Widget _gallerySection() {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final allImages = _existingImages.length + _pendingNewImages.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Galería de imágenes',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            if (allImages > 0) ...[
              const SizedBox(width: 8),
              _CountBadge(count: allImages, scheme: scheme),
            ],
          ],
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 100,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.zero,
            itemCount: _existingImages.length + _pendingNewImages.length + 1,
            separatorBuilder: (context, i) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              // Imágenes ya guardadas
              if (index < _existingImages.length) {
                final img = _existingImages[index];
                return _GalleryThumb.network(
                  url: img.imageUrl,
                  onRemove: () => setState(() {
                    _removedImageIds.add(img.id);
                    _existingImages.removeAt(index);
                  }),
                  onSetCover: () => setState(() {
                    _data.thumbnailUrl = img.imageUrl;
                    _pendingCoverIndex = null;
                  }),
                  isCover: _data.thumbnailUrl == img.imageUrl,
                );
              }

              // Imágenes nuevas pendientes de subir
              final pi = index - _existingImages.length;
              if (pi < _pendingNewImages.length) {
                return _GalleryThumb.file(
                  file: _pendingNewImages[pi],
                  onRemove: () =>
                      setState(() => _pendingNewImages.removeAt(pi)),
                  onSetCover: () => setState(() {
                    _pendingCoverIndex = pi;
                    _data.thumbnailUrl = '';
                  }),
                  isCover: _pendingCoverIndex == pi,
                );
              }

              // Botón "Añadir imagen"
              return _AddImageButton(
                scheme: scheme,
                onTap: _isLoading ? null : _pickGalleryImage,
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _submitButton() => SizedBox(
    width: double.infinity,
    child: FilledButton.icon(
      onPressed: _isLoading ? null : _submit,
      icon: Icon(widget.isEditing ? Icons.save_rounded : Icons.add_rounded),
      label: Text(widget.isEditing ? 'Guardar cambios' : 'Crear proyecto'),
      style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52)),
    ),
  );
}

// ── Widgets auxiliares ────────────────────────────────────────────────────────

class _InlineError extends StatelessWidget {
  const _InlineError({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: scheme.errorContainer,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(Icons.error_outline_rounded, color: scheme.onErrorContainer),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              message,
              style: TextStyle(color: scheme.onErrorContainer),
            ),
          ),
        ],
      ),
    );
  }
}

/// Miniatura de galería (red o archivo local) con botón de eliminar.
class _GalleryThumb extends StatelessWidget {
  const _GalleryThumb.network({
    required String url,
    required this.onRemove,
    this.onSetCover,
    this.isCover = false,
  }) : _url = url,
       _file = null;

  const _GalleryThumb.file({
    required File file,
    required this.onRemove,
    this.onSetCover,
    this.isCover = false,
  }) : _url = null,
       _file = file;

  final String? _url;
  final File? _file;
  final VoidCallback onRemove;
  final VoidCallback? onSetCover;
  final bool isCover;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    Widget img;
    if (_url != null) {
      img = CachedNetworkImage(
        imageUrl: _url,
        width: 100,
        height: 100,
        fit: BoxFit.cover,
        placeholder: (context, url) =>
            Container(color: scheme.surfaceContainerHighest),
        errorWidget: (context, url, error) => Container(
          color: scheme.surfaceContainerHighest,
          child: Icon(
            Icons.broken_image_outlined,
            color: scheme.outlineVariant,
          ),
        ),
      );
    } else {
      img = Image.file(_file!, width: 100, height: 100, fit: BoxFit.cover);
    }

    return Stack(
      children: [
        ClipRRect(borderRadius: BorderRadius.circular(10), child: img),
        // Botón para marcar como miniatura
        if (onSetCover != null)
          Positioned(
            top: 3,
            left: 3,
            child: GestureDetector(
              onTap: onSetCover,
              child: Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: isCover
                      ? Colors.amber
                      : Colors.black.withValues(alpha: 0.55),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isCover ? Icons.star : Icons.star_border,
                  size: 14,
                  color: isCover ? Colors.black : Colors.white,
                ),
              ),
            ),
          ),
        Positioned(
          top: 3,
          right: 3,
          child: GestureDetector(
            onTap: onRemove,
            child: Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.65),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.close_rounded,
                size: 14,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

/// Botón cuadrado para añadir imagen a la galería.
class _AddImageButton extends StatelessWidget {
  const _AddImageButton({required this.scheme, this.onTap});

  final ColorScheme scheme;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        height: 100,
        decoration: BoxDecoration(
          color: scheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: scheme.outlineVariant),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.add_photo_alternate_outlined, color: scheme.primary),
            const SizedBox(height: 4),
            Text(
              'Añadir',
              style: TextStyle(fontSize: 11, color: scheme.outline),
            ),
          ],
        ),
      ),
    );
  }
}

/// Badge circular con el conteo de imágenes.
class _CountBadge extends StatelessWidget {
  const _CountBadge({required this.count, required this.scheme});
  final int count;
  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
      decoration: BoxDecoration(
        color: scheme.primaryContainer,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        '$count',
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: scheme.onPrimaryContainer,
        ),
      ),
    );
  }
}

// La selección de portada ahora se realiza marcando una miniatura en la galería.
