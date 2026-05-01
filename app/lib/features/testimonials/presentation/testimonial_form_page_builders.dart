part of 'testimonial_form_page.dart';

extension _TestimonialFormPageBuilders on _TestimonialFormPageState {
  Widget _buildBody(BuildContext context) {
    final theme = Theme.of(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_hasDraft)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: DraftRestoreBanner(
                  onRestore: () => restoreDraft(),
                  onDiscard: () => discardDraft(),
                ),
              ),
            // ── Datos del autor ────────────────────────────────────────────
            Text('Datos del autor', style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
            TextFormField(
              controller: _nameCtrl,
              decoration: const InputDecoration(
                labelText: 'Nombre *',
                helperText: 'Nombre del cliente que dio el testimonio',
              ),
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
                    validator: AppValidators.emailOptional,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: IntlPhoneField(
                    decoration: const InputDecoration(
                      labelText: 'Teléfono',
                      counterText: '',
                    ),
                    initialValue: _completePhone,
                    initialCountryCode: 'ES',
                    invalidNumberMessage: 'Número de teléfono inválido',
                    keyboardType: TextInputType.phone,
                    onChanged: (phone) {
                      _completePhone = phone.completeNumber;
                    },
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
              decoration: const InputDecoration(
                labelText: 'Texto completo *',
                helperText: 'La reseña completa del cliente',
              ),
              maxLines: 5,
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'Requerido' : null,
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
                      color: AppColors.warning,
                      size: 28,
                    ),
                  ),
                const SizedBox(width: 8),
                Text('$_rating/5', style: theme.textTheme.bodySmall),
              ],
            ),
            const SizedBox(height: 24),

            // ── Moderación ─────────────────────────────────────────────────
            Text('Moderación', style: theme.textTheme.titleMedium),
            const SizedBox(height: 12),
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
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  void _populateForm(TestimonialDetail d) {
    _nameCtrl.text = d.name;
    _textCtrl.text = d.text;
    _emailCtrl.text = d.email ?? '';
    _completePhone = d.phone;
    _positionCtrl.text = d.position ?? '';
    _companyCtrl.text = d.company ?? '';
    _avatarCtrl.text = d.avatarUrl ?? '';
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
        phone: (_completePhone?.trim().isEmpty ?? true)
            ? null
            : _completePhone!.trim(),
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
}
