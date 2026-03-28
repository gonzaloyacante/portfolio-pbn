import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../core/utils/app_logger.dart';
import '../../../shared/widgets/widgets.dart';
import '../../categories/providers/categories_provider.dart';
import '../data/project_model.dart';
import '../data/projects_repository.dart';
import '../providers/projects_provider.dart';
import 'widgets/add_image_button.dart';
import 'widgets/count_badge.dart';
import 'widgets/gallery_thumb.dart';

part 'project_form_page_builders.dart';

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
  bool _initialized =
      false; // Tracks whether form was populated from server data

  // Galería de imágenes
  List<ProjectImage> _existingImages = [];
  bool _galleryReordered = false;

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

  void _rebuild(VoidCallback fn) => setState(fn);

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
    if (_initialized) return;
    _initialized = true;
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

      // 2b. Si se reordenó la galería, enviar nuevo orden al backend.
      if (_galleryReordered && _existingImages.isNotEmpty) {
        await repo.reorderImages(projectId, [
          for (int i = 0; i < _existingImages.length; i++)
            {'id': _existingImages[i].id, 'order': i},
        ]);
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
}
