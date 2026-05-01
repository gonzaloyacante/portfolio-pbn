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

              SettingsFormCard(
                title: 'Sombra foto de perfil',
                children: [
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Activar sombra'),
                    value: _shadowEnabled,
                    onChanged: (v) => setState(() {
                      _shadowEnabled = v;
                      _isDirty = true;
                    }),
                  ),
                  TextFormField(
                    controller: _shadowColorCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Color HEX (vacío = marca)',
                      hintText: '#6c0a0a',
                    ),
                    onChanged: (_) => _markDirty(),
                  ),
                  Text('Opacidad: $_shadowOpacity%'),
                  Slider(
                    value: _shadowOpacity.toDouble(),
                    min: 0,
                    max: 100,
                    divisions: 20,
                    label: '$_shadowOpacity%',
                    onChanged: (v) => setState(() {
                      _shadowOpacity = v.round();
                      _isDirty = true;
                    }),
                  ),
                  Text('Desenfoque: $_shadowBlur px'),
                  Slider(
                    value: _shadowBlur.toDouble(),
                    min: 0,
                    max: 80,
                    divisions: 16,
                    label: '$_shadowBlur',
                    onChanged: (v) => setState(() {
                      _shadowBlur = v.round();
                      _isDirty = true;
                    }),
                  ),
                  Text('Spread: $_shadowSpread px'),
                  Slider(
                    value: _shadowSpread.toDouble(),
                    min: -40,
                    max: 40,
                    divisions: 16,
                    label: '$_shadowSpread',
                    onChanged: (v) => setState(() {
                      _shadowSpread = v.round();
                      _isDirty = true;
                    }),
                  ),
                  Text('Offset X: $_shadowOx px'),
                  Slider(
                    value: _shadowOx.toDouble(),
                    min: -80,
                    max: 80,
                    divisions: 16,
                    label: '$_shadowOx',
                    onChanged: (v) => setState(() {
                      _shadowOx = v.round();
                      _isDirty = true;
                    }),
                  ),
                  Text('Offset Y: $_shadowOy px'),
                  Slider(
                    value: _shadowOy.toDouble(),
                    min: -80,
                    max: 80,
                    divisions: 16,
                    label: '$_shadowOy',
                    onChanged: (v) => setState(() {
                      _shadowOy = v.round();
                      _isDirty = true;
                    }),
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

    ref.listen<AsyncValue<AboutSettings>>(aboutSettingsProvider, (_, next) {
      next.whenData((settings) {
        if (!mounted || _populated || _isDirty) {
          return;
        }
        _populate(settings);
        _populated = true;
        setState(() {});
      });
    });

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
            error: (e, _) => ErrorState.forFailure(
              e,
              onRetry: () => ref.invalidate(aboutSettingsProvider),
            ),
            data: (settings) {
              return RefreshIndicator(
                onRefresh: () async {
                  ref.invalidate(aboutSettingsProvider);
                  final s = await ref.read(aboutSettingsProvider.future);
                  if (!mounted || _isDirty) {
                    return;
                  }
                  _populate(s);
                  _populated = true;
                  setState(() {});
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
    _bioTitleCtrl.text = s.bioTitle ?? '';
    _bioIntroCtrl.text = s.bioIntro ?? '';
    _bioDescCtrl.text = s.bioDescription ?? '';
    _profileImageCtrl.text = s.profileImageUrl ?? '';
    _shadowEnabled = s.profileImageShadowEnabled;
    _shadowBlur = s.profileImageShadowBlur ?? 24;
    _shadowSpread = s.profileImageShadowSpread ?? 0;
    _shadowOx = s.profileImageShadowOffsetX ?? 0;
    _shadowOy = s.profileImageShadowOffsetY ?? 8;
    _shadowOpacity = s.profileImageShadowOpacity ?? 35;
    _shadowColorCtrl.text = s.profileImageShadowColor ?? '';

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
        'profileImageShadowEnabled': _shadowEnabled,
        'profileImageShadowBlur': _shadowBlur,
        'profileImageShadowSpread': _shadowSpread,
        'profileImageShadowOffsetX': _shadowOx,
        'profileImageShadowOffsetY': _shadowOy,
        'profileImageShadowOpacity': _shadowOpacity,
        'profileImageShadowColor': _nullIfEmpty(_shadowColorCtrl.text),
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
