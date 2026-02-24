import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_cropper/image_cropper.dart';

import '../../../core/api/upload_service.dart';
import '../../../shared/widgets/image_upload_widget.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../data/testimonial_model.dart';
import '../providers/testimonials_provider.dart';

class TestimonialFormPage extends ConsumerStatefulWidget {
  const TestimonialFormPage({super.key, this.testimonialId});

  final String? testimonialId;

  @override
  ConsumerState<TestimonialFormPage> createState() =>
      _TestimonialFormPageState();
}

class _TestimonialFormPageState extends ConsumerState<TestimonialFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _textCtrl = TextEditingController();
  final _excerptCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _positionCtrl = TextEditingController();
  final _companyCtrl = TextEditingController();
  final _websiteCtrl = TextEditingController();
  final _avatarCtrl = TextEditingController();
  File? _pendingAvatar;
  final _sourceCtrl = TextEditingController();

  int _rating = 5;
  bool _verified = false;
  bool _featured = false;
  bool _isActive = true;
  String _status = 'PENDING';
  bool _loading = false;
  bool _populated = false;

  bool get _isEdit => widget.testimonialId != null;

  @override
  void dispose() {
    for (final ctrl in [
      _nameCtrl,
      _textCtrl,
      _excerptCtrl,
      _emailCtrl,
      _phoneCtrl,
      _positionCtrl,
      _companyCtrl,
      _websiteCtrl,
      _avatarCtrl,
      _sourceCtrl,
    ]) {
      ctrl.dispose();
    }
    super.dispose();
  }

  void _populateForm(TestimonialDetail d) {
    if (_populated) return;
    _populated = true;
    _nameCtrl.text = d.name;
    _textCtrl.text = d.text;
    _excerptCtrl.text = d.excerpt ?? '';
    _emailCtrl.text = d.email ?? '';
    _phoneCtrl.text = d.phone ?? '';
    _positionCtrl.text = d.position ?? '';
    _companyCtrl.text = d.company ?? '';
    _websiteCtrl.text = d.website ?? '';
    _avatarCtrl.text = d.avatarUrl ?? '';
    _sourceCtrl.text = d.source ?? '';
    setState(() {
      _rating = d.rating;
      _verified = d.verified;
      _featured = d.featured;
      _isActive = d.isActive;
      _status = d.status;
    });
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);

    try {
      // Subir avatar si se seleccionó uno nuevo.
      if (_pendingAvatar != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        _avatarCtrl.text = await uploadSvc.uploadImage(
          _pendingAvatar!,
          folder: 'portfolio/testimonials',
        );
      }

      final data = TestimonialFormData(
        name: _nameCtrl.text.trim(),
        text: _textCtrl.text.trim(),
        excerpt: _excerptCtrl.text.trim().isEmpty
            ? null
            : _excerptCtrl.text.trim(),
        email: _emailCtrl.text.trim().isEmpty ? null : _emailCtrl.text.trim(),
        phone: _phoneCtrl.text.trim().isEmpty ? null : _phoneCtrl.text.trim(),
        position: _positionCtrl.text.trim().isEmpty
            ? null
            : _positionCtrl.text.trim(),
        company: _companyCtrl.text.trim().isEmpty
            ? null
            : _companyCtrl.text.trim(),
        website: _websiteCtrl.text.trim().isEmpty
            ? null
            : _websiteCtrl.text.trim(),
        avatarUrl: _avatarCtrl.text.trim().isEmpty
            ? null
            : _avatarCtrl.text.trim(),
        source: _sourceCtrl.text.trim().isEmpty
            ? null
            : _sourceCtrl.text.trim(),
        rating: _rating,
        verified: _verified,
        featured: _featured,
        status: _status,
        isActive: _isActive,
      );

      if (_isEdit) {
        await ref
            .read(testimonialsRepositoryProvider)
            .updateTestimonial(widget.testimonialId!, data.toJson());
      } else {
        await ref.read(testimonialsRepositoryProvider).createTestimonial(data);
      }

      ref.invalidate(testimonialsListProvider);
      if (mounted) {
        final msg = _isEdit ? 'Testimonio actualizado' : 'Testimonio creado';
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(msg)));
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    Widget body = SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Datos del autor ────────────────────────────────────────────
            Text('Datos del autor', style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
            TextFormField(
              controller: _nameCtrl,
              decoration: const InputDecoration(labelText: 'Nombre *'),
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Requerido' : null,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _positionCtrl,
                    decoration: const InputDecoration(labelText: 'Cargo'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _companyCtrl,
                    decoration: const InputDecoration(labelText: 'Empresa'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _emailCtrl,
                    decoration: const InputDecoration(labelText: 'Email'),
                    keyboardType: TextInputType.emailAddress,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _phoneCtrl,
                    decoration: const InputDecoration(labelText: 'Teléfono'),
                    keyboardType: TextInputType.phone,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Avatar del cliente
            ImageUploadWidget(
              label: 'Foto del cliente (opcional)',
              currentImageUrl: _avatarCtrl.text.isNotEmpty
                  ? _avatarCtrl.text
                  : null,
              hint: 'Toca para seleccionar foto del cliente',
              aspectRatio: const CropAspectRatio(ratioX: 1, ratioY: 1),
              onImageSelected: (file) {
                setState(() => _pendingAvatar = file);
              },
              onImageRemoved: () {
                setState(() {
                  _pendingAvatar = null;
                  _avatarCtrl.clear();
                });
              },
              height: 140,
            ),
            const SizedBox(height: 24),

            // ── Testimonio ─────────────────────────────────────────────────
            Text('Testimonio', style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
            TextFormField(
              controller: _textCtrl,
              decoration: const InputDecoration(labelText: 'Texto completo *'),
              maxLines: 5,
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Requerido' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _excerptCtrl,
              decoration: const InputDecoration(
                labelText: 'Extracto (opcional)',
                hintText: 'Resumen breve para mostrar en la galería',
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 12),
            // Rating
            Row(
              children: [
                Text('Valoración:', style: theme.textTheme.bodyMedium),
                const SizedBox(width: 12),
                for (int i = 1; i <= 5; i++)
                  GestureDetector(
                    onTap: () => setState(() => _rating = i),
                    child: Icon(
                      i <= _rating ? Icons.star : Icons.star_border,
                      color: Colors.amber,
                      size: 28,
                    ),
                  ),
                const SizedBox(width: 8),
                Text('$_rating/5', style: theme.textTheme.bodySmall),
              ],
            ),
            const SizedBox(height: 24),

            // ── Metadatos ──────────────────────────────────────────────────
            Text('Metadatos', style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _websiteCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Sitio web',
                      hintText: 'https://...',
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _sourceCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente',
                      hintText: 'Google, Instagram…',
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // ── Moderación ─────────────────────────────────────────────────
            Text('Moderación', style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _status,
              decoration: const InputDecoration(labelText: 'Estado'),
              items: const [
                DropdownMenuItem(value: 'PENDING', child: Text('Pendiente')),
                DropdownMenuItem(value: 'APPROVED', child: Text('Aprobado')),
                DropdownMenuItem(value: 'REJECTED', child: Text('Rechazado')),
              ],
              onChanged: (v) {
                if (v != null) setState(() => _status = v);
              },
            ),
            const SizedBox(height: 12),
            SwitchListTile(
              title: const Text('Verificado'),
              subtitle: const Text('Testimonio confirmado por el autor'),
              value: _verified,
              onChanged: (v) => setState(() => _verified = v),
            ),
            SwitchListTile(
              title: const Text('Destacado'),
              subtitle: const Text('Mostrar en sección principal'),
              value: _featured,
              onChanged: (v) => setState(() => _featured = v),
            ),
            SwitchListTile(
              title: const Text('Activo'),
              subtitle: const Text('Visible en el portfolio público'),
              value: _isActive,
              onChanged: (v) => setState(() => _isActive = v),
            ),
            const SizedBox(height: 32),

            FilledButton.icon(
              onPressed: _submit,
              icon: const Icon(Icons.save),
              label: Text(_isEdit ? 'Guardar cambios' : 'Crear testimonio'),
            ),
          ],
        ),
      ),
    );

    if (_isEdit) {
      final detailAsync = ref.watch(
        testimonialDetailProvider(widget.testimonialId!),
      );
      body = detailAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
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
