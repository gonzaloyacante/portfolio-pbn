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
                DropdownMenuItem(value: 'PENDING', child: const Text('Pendiente')),
                DropdownMenuItem(value: 'APPROVED', child: const Text('Aprobado')),
                DropdownMenuItem(value: 'REJECTED', child: const Text('Rechazado')),
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
}
