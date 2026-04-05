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
                  ColorField(controller: _primaryCtrl, label: 'Primario'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _secondaryCtrl, label: 'Secundario'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _accentCtrl, label: 'Acento'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _bgCtrl, label: 'Fondo'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _textCtrl, label: 'Texto'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _cardBgCtrl, label: 'Fondo tarjetas'),
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
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkSecondaryCtrl,
                    label: 'Secundario (dark)',
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkAccentCtrl,
                    label: 'Acento (dark)',
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _darkBgCtrl, label: 'Fondo (dark)'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(controller: _darkTextCtrl, label: 'Texto (dark)'),
                  const SizedBox(height: AppSpacing.md),
                  ColorField(
                    controller: _darkCardBgCtrl,
                    label: 'Fondo tarjetas (dark)',
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),

              // ── Tipografías base ───────────────────────────────────
              SettingsFormCard(
                title: 'Tipografías — Base',
                children: [
                  TextFormField(
                    controller: _headingFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente de títulos',
                      prefixIcon: Icon(Icons.title),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _headingFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño títulos (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _bodyFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente de cuerpo',
                      prefixIcon: Icon(Icons.text_fields),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _bodyFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño cuerpo (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _scriptFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente script/decorativa',
                      prefixIcon: Icon(Icons.font_download_outlined),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _scriptFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño script (px)',
                      prefixIcon: Icon(Icons.format_size),
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
                  TextFormField(
                    controller: _brandFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente título "Make-up"',
                      prefixIcon: Icon(Icons.branding_watermark),
                      hintText: 'Ej: Saira Extra Condensed',
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _brandFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _portfolioFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente título "Portfolio"',
                      prefixIcon: Icon(Icons.branding_watermark),
                      hintText: 'Ej: Saira Extra Condensed',
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _portfolioFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: Icon(Icons.format_size),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  TextFormField(
                    controller: _signatureFontCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Fuente firma',
                      prefixIcon: Icon(Icons.draw_outlined),
                      hintText: 'Ej: Dawning of a New Day',
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  TextFormField(
                    controller: _signatureFontSizeCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Tamaño (px)',
                      prefixIcon: Icon(Icons.format_size),
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
                      prefixIcon: Icon(Icons.rounded_corner),
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
