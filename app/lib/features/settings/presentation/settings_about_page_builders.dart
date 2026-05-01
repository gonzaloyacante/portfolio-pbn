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
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _bioDescCtrl,
                    maxLines: 5,
                    decoration: const InputDecoration(
                      labelText: 'Descripción',
                      border: OutlineInputBorder(),
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

  Widget _buildScaffold(BuildContext context) {
    final async = ref.watch(aboutSettingsProvider);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, Object? result) =>
          _maybeLeave(context),
      child: AppScaffold(
        title: 'Sobre mí',
        actions: [
          IconButton(
            icon: const Icon(Icons.save_outlined),
            tooltip: 'Guardar',
            onPressed: _save,
          ),
        ],
        body: LoadingOverlay(
          isLoading: _saving,
          child: async.when(
            loading: () =>
                const SkeletonSettingsPage(cardCount: 3, fieldsPerCard: 3),
            error: (e, _) => ErrorState(
              message: e.toString(),
              onRetry: () => ref.invalidate(aboutSettingsProvider),
            ),
            data: (settings) {
              _populate(settings);
              return RefreshIndicator(
                onRefresh: () async {
                  ref.invalidate(aboutSettingsProvider);
                  await ref.read(aboutSettingsProvider.future);
                },
                child: _buildForm(context),
              );
            },
          ),
        ),
      ),
    );
  }

  void _populate(AboutSettings s) {
    if (_populated) return;
    _populated = true;

    _bioTitleCtrl.text = s.bioTitle ?? '';
    _bioIntroCtrl.text = s.bioIntro ?? '';
    _bioDescCtrl.text = s.bioDescription ?? '';
    _profileImageCtrl.text = s.profileImageUrl ?? '';

    _populateList(s.skills, _skillsCtrls, _skillsFocus);
    _populateList(s.certifications, _certificationsCtrls, _certificationsFocus);

    if (_skillsCtrls.isEmpty) _addField(_skillsCtrls, _skillsFocus);
    if (_certificationsCtrls.isEmpty) {
      _addField(_certificationsCtrls, _certificationsFocus);
    }
  }

  void _populateList(
    List<String> items,
    List<TextEditingController> ctrls,
    List<FocusNode> focusNodes,
  ) {
    for (final c in ctrls) {
      c.dispose();
    }
    for (final f in focusNodes) {
      f.dispose();
    }
    ctrls.clear();
    focusNodes.clear();

    final expanded = items
        .expand((v) => v.split('\n'))
        .expand((v) => v.split(','))
        .map((v) => v.trim())
        .where((v) => v.isNotEmpty)
        .toList();

    for (final value in expanded) {
      ctrls.add(TextEditingController(text: value));
      focusNodes.add(FocusNode());
    }
  }

  void _addField(
    List<TextEditingController> ctrls,
    List<FocusNode> focusNodes,
  ) {
    ctrls.add(TextEditingController());
    focusNodes.add(FocusNode());
  }

  void _removeField(
    int i,
    List<TextEditingController> ctrls,
    List<FocusNode> focusNodes,
  ) {
    if (i < 0 || i >= ctrls.length) return;
    ctrls.removeAt(i).dispose();
    focusNodes.removeAt(i).dispose();
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      if (_pendingProfileImage != null) {
        final svc = ref.read(uploadServiceProvider);
        final result = await svc.uploadImageFull(
          _pendingProfileImage!,
          folder: 'portfolio/about',
        );
        _profileImageCtrl.text = result.url;
      }

      await ref.read(settingsRepositoryProvider).updateAbout({
        'bioTitle': _nullIfEmpty(_bioTitleCtrl.text),
        'bioIntro': _nullIfEmpty(_bioIntroCtrl.text),
        'bioDescription': _nullIfEmpty(_bioDescCtrl.text),
        'profileImageUrl': _nullIfEmpty(_profileImageCtrl.text),
        'skills': _skillsCtrls
            .map((c) => c.text.trim())
            .where((s) => s.isNotEmpty)
            .toList(),
        'certifications': _certificationsCtrls
            .map((c) => c.text.trim())
            .where((s) => s.isNotEmpty)
            .toList(),
      });

      ref.invalidate(aboutSettingsProvider);
      if (mounted) {
        setState(() => _isDirty = false);
        AppSnackBar.success(context, 'Configuración guardada');
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        AppSnackBar.error(context, 'No se pudo guardar. Inténtalo de nuevo.');
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  String? _nullIfEmpty(String v) => v.trim().isEmpty ? null : v.trim();

  // ── Build ─────────────────────────────────────────────────────────────────

  Future<void> _maybeLeave(BuildContext context) async {
    if (!_isDirty) {
      context.pop();
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
