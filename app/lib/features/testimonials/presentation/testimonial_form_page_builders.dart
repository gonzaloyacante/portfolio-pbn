part of 'testimonial_form_page.dart';

extension _TestimonialFormPageBuilders on _TestimonialFormPageState {
  Widget _buildBody(BuildContext context) {
    final theme = Theme.of(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: AdaptiveFormLayout(
          mainAxisSpacing: 16,
          crossAxisSpacing: 12,
          children: [
            if (_hasDraft)
              AdaptiveFormLayout.fullWidth(
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: DraftRestoreBanner(
                    onRestore: () => restoreDraft(),
                    onDiscard: () => discardDraft(),
                  ),
                ),
              ),
            AdaptiveFormLayout.fullWidth(
              Text('Datos del autor', style: theme.textTheme.titleMedium),
            ),
            TextFormField(
              controller: _nameCtrl,
              decoration: const InputDecoration(
                labelText: 'Nombre *',
                helperText: 'Nombre del cliente que dio el testimonio',
              ),
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Requerido' : null,
            ),
            TextFormField(
              controller: _positionCtrl,
              decoration: const InputDecoration(labelText: 'Cargo'),
            ),
            TextFormField(
              controller: _companyCtrl,
              decoration: const InputDecoration(labelText: 'Empresa'),
            ),
            TextFormField(
              controller: _emailCtrl,
              decoration: const InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
              validator: AppValidators.emailOptional,
            ),
            PhoneInputField(
              key: ValueKey<String>(
                '${widget.testimonialId ?? 'new'}|$_populated',
              ),
              controller: _phoneCtrl,
              label: 'Teléfono',
            ),
            AdaptiveFormLayout.fullWidth(
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
            ),
            AdaptiveFormLayout.fullWidth(
              Text('Testimonio', style: theme.textTheme.titleMedium),
            ),
            AdaptiveFormLayout.fullWidth(
              TextFormField(
                controller: _textCtrl,
                decoration: const InputDecoration(
                  labelText: 'Texto completo *',
                  helperText: 'La reseña completa del cliente',
                ),
                maxLines: 5,
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Requerido' : null,
              ),
            ),
            AdaptiveFormLayout.fullWidth(
              Row(
                children: [
                  Text('Valoración:', style: theme.textTheme.bodyMedium),
                  const SizedBox(width: 12),
                  for (int i = 1; i <= 5; i++)
                    GestureDetector(
                      onTap: () => setState(() => _rating = i),
                      child: Icon(
                        i <= _rating ? Icons.star : Icons.star_border,
                        color: AppColors.warning,
                        size: 28,
                      ),
                    ),
                  const SizedBox(width: 8),
                  Text('$_rating/5', style: theme.textTheme.bodySmall),
                ],
              ),
            ),
            AdaptiveFormLayout.fullWidth(
              Text('Moderación', style: theme.textTheme.titleMedium),
            ),
            AdaptiveFormLayout.fullWidth(
              DropdownButtonFormField<String>(
                value: _status,
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
            ),
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
            AdaptiveFormLayout.fullWidth(
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: FilledButton.icon(
                  onPressed: _submit,
                  icon: const Icon(Icons.save),
                  label: Text(_isEdit ? 'Guardar cambios' : 'Crear testimonio'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  void _populateForm(TestimonialDetail d) {
    _nameCtrl.text = d.name;
    _textCtrl.text = d.text;
    _emailCtrl.text = d.email ?? '';
    _phoneCtrl.text = d.phone ?? '';
    _positionCtrl.text = d.position ?? '';
    _companyCtrl.text = d.company ?? '';
    _avatarCtrl.text = d.avatarUrl ?? '';
    setState(() {
      _populated = true;
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
      if (_pendingAvatar != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        final result = await uploadSvc.uploadImageFull(
          _pendingAvatar!,
          folder: 'portfolio/testimonials',
        );
        _avatarCtrl.text = result.url;
      }

      final data = TestimonialFormData(
        name: _nameCtrl.text.trim(),
        text: _textCtrl.text.trim(),
        email: _emailCtrl.text.trim().isEmpty ? null : _emailCtrl.text.trim(),
        phone: _phoneCtrl.text.trim().isEmpty ? null : _phoneCtrl.text.trim(),
        position: _positionCtrl.text.trim().isEmpty
            ? null
            : _positionCtrl.text.trim(),
        company: _companyCtrl.text.trim().isEmpty
            ? null
            : _companyCtrl.text.trim(),
        avatarUrl: _avatarCtrl.text.trim().isEmpty
            ? null
            : _avatarCtrl.text.trim(),
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
        unawaited(ref.read(draftServiceProvider).clear(_draftScope));
        final msg = _isEdit ? 'Testimonio actualizado' : 'Testimonio creado';
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(msg)));
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

  Future<void> _maybeLeave(BuildContext context) async {
    if (!_isDirty) {
      if (context.mounted) context.pop();
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
}
