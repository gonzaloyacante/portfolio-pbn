import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/upload_service.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/image_upload_widget.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/project_model.dart';
import '../data/projects_repository.dart';
import '../providers/projects_provider.dart';

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
  File? _pendingCoverImage;

  @override
  Widget build(BuildContext context) {
    if (widget.isEditing) {
      final detailAsync = ref.watch(projectDetailProvider(widget.projectId!));
      return detailAsync.when(
        loading: () => Scaffold(
          appBar: AppBar(
            title: Text(
              widget.isEditing ? 'Editar proyecto' : 'Nuevo proyecto',
            ),
          ),
          body: const SkeletonListView(itemCount: 6),
        ),
        error: (err, _) => Scaffold(
          appBar: AppBar(title: const Text('Error')),
          body: ErrorState(message: err.toString()),
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
      // Subir imagen de portada si se seleccionó una nueva.
      if (_pendingCoverImage != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        _data.thumbnailUrl = await uploadSvc.uploadImage(
          _pendingCoverImage!,
          folder: 'portfolio/projects',
        );
      }

      final repo = ref.read(projectsRepositoryProvider);
      if (widget.isEditing) {
        await repo.updateProject(widget.projectId!, _data.toJson());
        ref.invalidate(projectDetailProvider(widget.projectId!));
      } else {
        await repo.createProject(_data);
      }
      ref.invalidate(projectsListProvider);
      if (mounted) context.pop();
    } catch (e) {
      setState(() => _errorMsg = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Widget _buildForm(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.isEditing ? 'Editar proyecto' : 'Nuevo proyecto'),
          actions: [
            TextButton.icon(
              onPressed: _isLoading ? null : _submit,
              icon: const Icon(Icons.check_rounded),
              label: Text(widget.isEditing ? 'Guardar' : 'Crear'),
            ),
          ],
        ),
        body: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_errorMsg != null) ...[
                  InlineError(message: _errorMsg!),
                  const SizedBox(height: 16),
                ],

                // Imagen de portada
                ImageUploadWidget(
                  label: 'Imagen de portada',
                  currentImageUrl: _data.thumbnailUrl.isNotEmpty
                      ? _data.thumbnailUrl
                      : null,
                  onImageSelected: (file) {
                    setState(() => _pendingCoverImage = file);
                  },
                ),
                const SizedBox(height: 20),

                // Título
                TextFormField(
                  initialValue: _data.title,
                  decoration: const InputDecoration(labelText: 'Título *'),
                  textInputAction: TextInputAction.next,
                  onSaved: (v) => _data.title = v?.trim() ?? '',
                  validator: (v) => (v == null || v.trim().isEmpty)
                      ? 'El título es requerido'
                      : null,
                ),
                const SizedBox(height: 12),

                // Slug
                TextFormField(
                  initialValue: _data.slug,
                  decoration: const InputDecoration(
                    labelText: 'Slug *',
                    hintText: 'mi-proyecto',
                    prefixText: '/',
                  ),
                  textInputAction: TextInputAction.next,
                  onSaved: (v) => _data.slug = v?.trim() ?? '',
                  validator: (v) => (v == null || v.trim().isEmpty)
                      ? 'El slug es requerido'
                      : null,
                ),
                const SizedBox(height: 12),

                // Descripción
                TextFormField(
                  initialValue: _data.description,
                  maxLines: 5,
                  decoration: const InputDecoration(
                    labelText: 'Descripción *',
                    alignLabelWithHint: true,
                  ),
                  onSaved: (v) => _data.description = v?.trim() ?? '',
                  validator: (v) => (v == null || v.trim().isEmpty)
                      ? 'La descripción es requerida'
                      : null,
                ),
                const SizedBox(height: 12),

                // Extracto
                TextFormField(
                  initialValue: _data.excerpt,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Extracto (opcional)',
                    alignLabelWithHint: true,
                  ),
                  onSaved: (v) => _data.excerpt = (v?.trim().isEmpty ?? true)
                      ? null
                      : v!.trim(),
                ),
                const SizedBox(height: 12),

                // Cliente / Duración
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        initialValue: _data.client,
                        decoration: const InputDecoration(labelText: 'Cliente'),
                        textInputAction: TextInputAction.next,
                        onSaved: (v) => _data.client =
                            (v?.trim().isEmpty ?? true) ? null : v!.trim(),
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
                        onSaved: (v) => _data.duration =
                            (v?.trim().isEmpty ?? true) ? null : v!.trim(),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Destacado / Fijado
                Row(
                  children: [
                    Expanded(
                      child: SwitchListTile(
                        title: const Text('Destacado'),
                        subtitle: const Text('Aparece en galería principal'),
                        value: _data.isFeatured,
                        onChanged: (v) => setState(() => _data.isFeatured = v),
                        contentPadding: EdgeInsets.zero,
                      ),
                    ),
                    Expanded(
                      child: SwitchListTile(
                        title: const Text('Fijado'),
                        subtitle: const Text('Siempre al inicio'),
                        value: _data.isPinned,
                        onChanged: (v) => setState(() => _data.isPinned = v),
                        contentPadding: EdgeInsets.zero,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Submit
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: _isLoading ? null : _submit,
                    icon: Icon(
                      widget.isEditing ? Icons.save_rounded : Icons.add_rounded,
                    ),
                    label: Text(
                      widget.isEditing ? 'Guardar cambios' : 'Crear proyecto',
                    ),
                    style: FilledButton.styleFrom(
                      minimumSize: const Size.fromHeight(52),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
