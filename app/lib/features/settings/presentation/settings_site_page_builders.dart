part of 'settings_site_page.dart';

extension _SettingsSitePageBuilders on _SettingsSitePageState {
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
              // ── Encabezado ───────────────────────────────────────────────────
              SettingsFormCard(
                title: 'Encabezado',
                children: [
                  SwitchListTile(
                    title: const Text('Mostrar nombre en navbar'),
                    subtitle: const Text(
                      'Muestra u oculta el nombre de marca en la cabecera.',
                    ),
                    value: _navbarShowBrand,
                    onChanged: (v) => setState(() => _navbarShowBrand = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  if (_navbarShowBrand) ..._buildNavbarBrandFields(context),
                  const Divider(height: 24),
                  Text(
                    'Visibilidad de páginas',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                  const SizedBox(height: 4),
                  SwitchListTile(
                    title: const Text('Sobre mí'),
                    value: _showAbout,
                    onChanged: (v) => setState(() => _showAbout = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Portfolio'),
                    value: _showGallery,
                    onChanged: (v) => setState(() => _showGallery = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Servicios'),
                    value: _showServices,
                    onChanged: (v) => setState(() => _showServices = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                  SwitchListTile(
                    title: const Text('Contacto'),
                    value: _showContact,
                    onChanged: (v) => setState(() => _showContact = v),
                    contentPadding: EdgeInsets.zero,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              // ── Branding ─────────────────────────────────────────────────────
              SettingsFormCard(
                title: 'Branding',
                children: [
                  TextFormField(
                    controller: _siteNameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Nombre del sitio',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _siteTaglineCtrl,
                    decoration: const InputDecoration(labelText: 'Eslogan'),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              // ── SEO ────────────────────────────────────────────────────────
              SettingsFormCard(
                title: 'SEO',
                children: [
                  TextFormField(
                    controller: _metaTitleCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Meta título',
                      helperText: 'Título para buscadores (Google)',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _metaDescCtrl,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Meta descripción',
                      helperText: 'Descripción en resultados de búsqueda',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              // ── Mantenimiento ──────────────────────────────────────────────
              AppCard(
                color: _maintenanceMode
                    ? Colors.orange.withValues(alpha: 0.12)
                    : null,
                borderRadius: AppRadius.forCard,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.engineering_outlined,
                          color: Colors.orange,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Modo mantenimiento',
                          style: Theme.of(context).textTheme.titleSmall
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const Spacer(),
                        Switch(
                          value: _maintenanceMode,
                          onChanged: (v) =>
                              setState(() => _maintenanceMode = v),
                        ),
                      ],
                    ),
                    if (_maintenanceMode) ...[
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _maintenanceMsgCtrl,
                        maxLines: 2,
                        decoration: const InputDecoration(
                          labelText: 'Mensaje de mantenimiento',
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ],
                  ],
                ),
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

  List<Widget> _buildNavbarBrandFields(BuildContext context) {
    return [
      const SizedBox(height: 12),
      TextFormField(
        controller: _navbarBrandTextCtrl,
        decoration: const InputDecoration(
          labelText: 'Texto del nombre',
          hintText: 'Paola BN',
        ),
      ),
      const SizedBox(height: 12),
      Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: FontPickerField(
              value: _navbarBrandFont,
              label: 'Fuente',
              onChanged: (name, url) => setState(() {
                _navbarBrandFont = name;
                _navbarBrandFontUrl = url;
                _isDirty = true;
              }),
            ),
          ),
          const SizedBox(width: 12),
          SizedBox(
            width: 100,
            child: TextFormField(
              controller: _navbarBrandFontSizeCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Tamaño (px)',
                hintText: '30',
              ),
            ),
          ),
        ],
      ),
      const SizedBox(height: 12),
      Row(
        children: [
          Expanded(
            child: ColorPickerField(
              controller: _navbarBrandColorCtrl,
              label: 'Color claro',
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ColorPickerField(
              controller: _navbarBrandColorDarkCtrl,
              label: 'Color oscuro (modo oscuro)',
            ),
          ),
        ],
      ),
    ];
  }
}
