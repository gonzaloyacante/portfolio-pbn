part of 'settings_theme_page.dart';

extension _SettingsThemePageBuilders on _SettingsThemePageState {
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
              // ── Colores — Modo claro ───────────────────────────────
              SettingsFormCard(
                title: 'Colores — Modo claro',
                children: [
                  ColorField(
                    controller: _primaryCtrl,
                    label: 'Primario',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Primario',
                      hexColor: _primaryCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _secondaryCtrl,
                    label: 'Secundario',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Secundario',
                      hexColor: _secondaryCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _accentCtrl,
                    label: 'Acento',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Acento',
                      hexColor: _accentCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _bgCtrl,
                    label: 'Fondo',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Fondo',
                      hexColor: _bgCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _textCtrl,
                    label: 'Texto',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Texto',
                      hexColor: _textCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _cardBgCtrl,
                    label: 'Fondo tarjetas',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Fondo tarjetas',
                      hexColor: _cardBgCtrl.text,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Colores — Modo oscuro ──────────────────────────────
              SettingsFormCard(
                title: 'Colores — Modo oscuro',
                children: [
                  ColorField(
                    controller: _darkPrimaryCtrl,
                    label: 'Primario (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Primario (dark)',
                      hexColor: _darkPrimaryCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkSecondaryCtrl,
                    label: 'Secundario (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Secundario (dark)',
                      hexColor: _darkSecondaryCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkAccentCtrl,
                    label: 'Acento (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Acento (dark)',
                      hexColor: _darkAccentCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkBgCtrl,
                    label: 'Fondo (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Fondo (dark)',
                      hexColor: _darkBgCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkTextCtrl,
                    label: 'Texto (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Texto (dark)',
                      hexColor: _darkTextCtrl.text,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkCardBgCtrl,
                    label: 'Fondo tarjetas (dark)',
                    onInfoTap: () => showColorUsageSheet(
                      context,
                      label: 'Fondo tarjetas (dark)',
                      hexColor: _darkCardBgCtrl.text,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Tipografías base ───────────────────────────────────
              SettingsFormCard(
                title: 'Tipografías — Base',
                children: [
                  FontPickerField(
                    label: 'Fuente de títulos',
                    value: _headingFontCtrl.text.isEmpty
                        ? null
                        : _headingFontCtrl.text,
                    onChanged: (name, _) {
                      _headingFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _headingFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño títulos (px)',
                      prefixIcon: const Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FontPickerField(
                    label: 'Fuente de cuerpo',
                    value: _bodyFontCtrl.text.isEmpty
                        ? null
                        : _bodyFontCtrl.text,
                    onChanged: (name, _) {
                      _bodyFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _bodyFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño cuerpo (px)',
                      prefixIcon: const Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FontPickerField(
                    label: 'Fuente script/decorativa',
                    value: _scriptFontCtrl.text.isEmpty
                        ? null
                        : _scriptFontCtrl.text,
                    onChanged: (name, _) {
                      _scriptFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _scriptFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño script (px)',
                      prefixIcon: const Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Tipografías — Marca ────────────────────────────────
              SettingsFormCard(
                title: 'Tipografías — Marca',
                children: [
                  FontPickerField(
                    label: 'Fuente título "Make-up"',
                    value: _brandFontCtrl.text.isEmpty
                        ? null
                        : _brandFontCtrl.text,
                    onChanged: (name, _) {
                      _brandFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _brandFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: const Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FontPickerField(
                    label: 'Fuente título "Portfolio"',
                    value: _portfolioFontCtrl.text.isEmpty
                        ? null
                        : _portfolioFontCtrl.text,
                    onChanged: (name, _) {
                      _portfolioFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _portfolioFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: const Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  FontPickerField(
                    label: 'Fuente firma',
                    value: _signatureFontCtrl.text.isEmpty
                        ? null
                        : _signatureFontCtrl.text,
                    onChanged: (name, _) {
                      _signatureFontCtrl.text = name;
                      _markDirty();
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _signatureFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: const Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Layout ─────────────────────────────────────────────
              SettingsFormCard(
                title: 'Layout',
                children: [
                  TextFormField(
                    controller: _borderRadiusCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Border radius (px)',
                      prefixIcon: const Icon(Icons.rounded_corner),
                      hintText: 'Ej: 40',
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Vista previa de colores ────────────────────────────
              ThemeColorPreview(
                lightPrimary: _primaryCtrl.text,
                lightSecondary: _secondaryCtrl.text,
                lightBg: _bgCtrl.text,
                darkPrimary: _darkPrimaryCtrl.text,
                darkBg: _darkBgCtrl.text,
              ),
              const SizedBox(height: AppSpacing.xl),

              FilledButton.icon(
                onPressed: _save,
                icon: const Icon(Icons.save_outlined),
                label: const Text('Guardar tema'),
              ),
              const SizedBox(height: AppSpacing.base),
            ],
          ),
        ),
      ),
    );
  }
}
