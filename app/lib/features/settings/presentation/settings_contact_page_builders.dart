part of 'settings_contact_page.dart';

extension _SettingsContactPageBuilders on _SettingsContactPageState {
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
              SettingsFormCard(
                title: 'Página de contacto',
                children: [
                  TextFormField(
                    controller: _pageTitleCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Título de página',
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _ownerNameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Nombre del propietario',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              SettingsFormCard(
                title: 'Datos de contacto',
                children: [
                  TextFormField(
                    controller: _emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      prefixIcon: const Icon(Icons.email_outlined),
                    ),
                  ),
                  const SizedBox(height: 12),
                  PhoneInputField(controller: _phoneCtrl, label: 'Teléfono'),
                  const SizedBox(height: 12),
                  PhoneInputField(controller: _whatsappCtrl, label: 'WhatsApp'),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _locationCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Ubicación',
                      prefixIcon: const Icon(Icons.location_on_outlined),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              AppCard(
                borderRadius: AppRadius.forCard,
                child: Column(
                  children: [
                    SwitchListTile(
                      title: const Text('Mostrar email'),
                      subtitle: const Text('Visible en la página de contacto'),
                      value: _showEmail,
                      onChanged: (v) => setState(() => _showEmail = v),
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20),
                        ),
                      ),
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      title: const Text('Mostrar teléfono'),
                      subtitle: const Text('Visible en la página de contacto'),
                      value: _showPhone,
                      onChanged: (v) => setState(() => _showPhone = v),
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      title: const Text('Mostrar WhatsApp'),
                      subtitle: const Text('Visible en la página de contacto'),
                      value: _showWhatsapp,
                      onChanged: (v) => setState(() => _showWhatsapp = v),
                    ),
                    const Divider(height: 1),
                    SwitchListTile(
                      title: const Text('Mostrar ubicación'),
                      subtitle: const Text('Visible en la página de contacto'),
                      value: _showLocation,
                      onChanged: (v) => setState(() => _showLocation = v),
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(20),
                          bottomRight: Radius.circular(20),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.md),
              AppCard(
                borderRadius: AppRadius.forCard,
                child: Column(
                  children: [
                    SwitchListTile(
                      title: const Text('Mostrar redes sociales'),
                      subtitle: const Text(
                        'Muestra iconos de redes en la página de contacto',
                      ),
                      value: _showSocialLinks,
                      onChanged: (v) => setState(() => _showSocialLinks = v),
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20),
                        ),
                      ),
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.share_outlined, size: 20),
                      title: const Text('Administrar redes sociales'),
                      subtitle: const Text(
                        'Activar o desactivar cada red individualmente',
                      ),
                      trailing: const Icon(
                        Icons.chevron_right_rounded,
                        size: 20,
                      ),
                      onTap: () => context.pushNamed(RouteNames.settingsSocial),
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(20),
                          bottomRight: Radius.circular(20),
                        ),
                      ),
                    ),
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
}
