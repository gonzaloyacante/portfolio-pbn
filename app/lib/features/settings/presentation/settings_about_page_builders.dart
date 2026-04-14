part of 'settings_about_page.dart';

extension _SettingsAboutPageBuilders on _SettingsAboutPageState {
  Widget _buildForm(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    final maxWidth = AppBreakpoints.value<double>(
      context,
      compact: double.infinity,
      medium: 760,
      expanded: 960,
    );

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: padding,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: maxWidth),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ── Bio ──────────────────────────────────────────────────────
              SettingsFormCard(
                title: 'Bio',
                children: [
                  TextFormField(
                    controller: _bioTitleCtrl,
                    decoration: const InputDecoration(labelText: 'Título'),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _bioIntroCtrl,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Intro',
                      border: const OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _bioDescCtrl,
                    maxLines: 5,
                    decoration: const InputDecoration(
                      labelText: 'Descripción',
                      border: const OutlineInputBorder(),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Imagen de perfil ─────────────────────────────────────────
              SettingsFormCard(
                title: 'Imagen de perfil',
                children: [
                  ImageUploadWidget(
                    label: 'Foto de perfil',
                    currentImageUrl: _profileImageCtrl.text.isNotEmpty
                        ? _profileImageCtrl.text
                        : null,
                    hint: 'Foto de perfil para la sección About',
                    onImageSelected: (file) =>
                        setState(() => _pendingProfileImage = file),
                    onImageRemoved: () => setState(() {
                      _pendingProfileImage = null;
                      _profileImageCtrl.clear();
                    }),
                    height: AppBreakpoints.value<double>(
                      context,
                      compact: 160,
                      medium: 200,
                      expanded: 220,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Habilidades ──────────────────────────────────────────────
              SettingsFormCard(
                title: 'Habilidades',
                children: [
                  DynamicItemList(
                    controllers: _skillsCtrls,
                    focusNodes: _skillsFocus,
                    labelPrefix: 'Habilidad',
                    addLabel: 'Agregar habilidad',
                    onAdd: () =>
                        setState(() => _addField(_skillsCtrls, _skillsFocus)),
                    onRemove: (i) => setState(() {
                      _removeField(i, _skillsCtrls, _skillsFocus);
                      if (_skillsCtrls.isEmpty) {
                        _addField(_skillsCtrls, _skillsFocus);
                      }
                    }),
                    onSubmit: () => setState(() {
                      _addField(_skillsCtrls, _skillsFocus);
                      Future.microtask(() => _skillsFocus.last.requestFocus());
                    }),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Certificaciones ──────────────────────────────────────────
              SettingsFormCard(
                title: 'Certificaciones',
                children: [
                  DynamicItemList(
                    controllers: _certificationsCtrls,
                    focusNodes: _certificationsFocus,
                    labelPrefix: 'Certificación',
                    addLabel: 'Agregar certificación',
                    onAdd: () => setState(
                      () =>
                          _addField(_certificationsCtrls, _certificationsFocus),
                    ),
                    onRemove: (i) => setState(() {
                      _removeField(
                        i,
                        _certificationsCtrls,
                        _certificationsFocus,
                      );
                      if (_certificationsCtrls.isEmpty) {
                        _addField(_certificationsCtrls, _certificationsFocus);
                      }
                    }),
                    onSubmit: () => setState(() {
                      _addField(_certificationsCtrls, _certificationsFocus);
                      Future.microtask(
                        () => _certificationsFocus.last.requestFocus(),
                      );
                    }),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.xl),

              FilledButton.icon(
                onPressed: _save,
                icon: const Icon(Icons.save_outlined),
                label: const Text('Guardar cambios'),
              ),
              const SizedBox(height: AppSpacing.base),
            ],
          ),
        ),
      ),
    );
  }
}
