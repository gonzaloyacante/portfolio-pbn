part of 'booking_form_page.dart';

extension _BookingFormScaffold on _BookingFormPageState {
  Widget _buildFormScaffold(BuildContext context) {
    final dateLabel = _date == null
        ? 'Seleccionar fecha y hora'
        : '${_date!.day}/${_date!.month}/${_date!.year}  '
              '${_date!.hour.toString().padLeft(2, '0')}:'
              '${_date!.minute.toString().padLeft(2, '0')}';

    return LoadingOverlay(
      isLoading: _saving,
      child: PopScope(
        canPop: false,
        onPopInvokedWithResult: (bool didPop, dynamic result) =>
            _maybeLeave(context),
        child: Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => _maybeLeave(context),
              tooltip: 'Volver',
            ),
            title: Text(_isEdit ? 'Editar reserva' : 'Nueva reserva'),
            centerTitle: false,
            actions: [
              TextButton(onPressed: _submit, child: const Text('GUARDAR')),
            ],
          ),
          body: Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                AdaptiveFormLayout(
                  mainAxisSpacing: 12,
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
                      AppCard(
                        borderRadius: AppRadius.forCard,
                        child: AdaptiveFormLayout(
                          maxWidth: double.infinity,
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12,
                          children: [
                            AdaptiveFormLayout.fullWidth(
                              Text(
                                'Datos del cliente',
                                style: Theme.of(context).textTheme.titleSmall
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                            TextFormField(
                              controller: _clientNameCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Nombre *',
                              ),
                              textCapitalization: TextCapitalization.words,
                              onChanged: (_) => _markDirty(),
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) {
                                  return 'Obligatorio';
                                }
                                if (v.trim().length < 2) {
                                  return 'Mínimo 2 caracteres';
                                }
                                return null;
                              },
                            ),
                            TextFormField(
                              controller: _clientEmailCtrl,
                              keyboardType: TextInputType.emailAddress,
                              decoration: const InputDecoration(
                                labelText: 'Email *',
                              ),
                              validator: AppValidators.email,
                            ),
                            PhoneInputField(
                              controller: _phoneCtrl,
                              label: 'Teléfono',
                            ),
                            TextFormField(
                              controller: _guestCountCtrl,
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(
                                labelText: 'Nº de asistentes',
                              ),
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) {
                                  return null;
                                }
                                final n = int.tryParse(v.trim());
                                if (n == null || n < 1) {
                                  return 'Mínimo 1 asistente';
                                }
                                if (n > 999) return 'Máximo 999 asistentes';
                                return null;
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    AdaptiveFormLayout.fullWidth(
                      AppCard(
                        borderRadius: AppRadius.forCard,
                        padding: EdgeInsets.zero,
                        child: ListTile(
                          leading: const Icon(Icons.calendar_month_outlined),
                          title: Text(dateLabel),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: _pickDateTime,
                        ),
                      ),
                    ),
                    AdaptiveFormLayout.fullWidth(
                      AppCard(
                        borderRadius: AppRadius.forCard,
                        child: AdaptiveFormLayout(
                          maxWidth: double.infinity,
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12,
                          children: [
                            AdaptiveFormLayout.fullWidth(
                              Text(
                                'Servicio',
                                style: Theme.of(context).textTheme.titleSmall
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                            AdaptiveFormLayout.fullWidth(
                              _buildServiceSelector(),
                            ),
                          ],
                        ),
                      ),
                    ),
                    AdaptiveFormLayout.fullWidth(
                      AppCard(
                        borderRadius: AppRadius.forCard,
                        child: AdaptiveFormLayout(
                          maxWidth: double.infinity,
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12,
                          children: [
                            AdaptiveFormLayout.fullWidth(
                              Text(
                                'Notas',
                                style: Theme.of(context).textTheme.titleSmall
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                            TextFormField(
                              controller: _notesCtrl,
                              maxLines: 4,
                              decoration: const InputDecoration(
                                hintText:
                                    'Observaciones, peticiones especiales…',
                                border: OutlineInputBorder(),
                                labelText: 'Notas del cliente',
                              ),
                            ),
                            TextFormField(
                              controller: _adminNotesCtrl,
                              maxLines: 3,
                              decoration: const InputDecoration(
                                hintText: 'Notas internas de administración…',
                                border: OutlineInputBorder(),
                                labelText: 'Notas internas (admin)',
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    AdaptiveFormLayout.fullWidth(
                      AppCard(
                        borderRadius: AppRadius.forCard,
                        child: AdaptiveFormLayout(
                          maxWidth: double.infinity,
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12,
                          children: [
                            AdaptiveFormLayout.fullWidth(
                              Text(
                                'Pago',
                                style: Theme.of(context).textTheme.titleSmall
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                            TextFormField(
                              controller: _totalAmountCtrl,
                              keyboardType:
                                  const TextInputType.numberWithOptions(
                                    decimal: true,
                                  ),
                              decoration: const InputDecoration(
                                labelText: 'Precio acordado (€)',
                                hintText: '0.00',
                                prefixIcon: Icon(Icons.euro_outlined),
                              ),
                              onChanged: (_) => _markDirty(),
                              validator: (v) {
                                if (v == null || v.trim().isEmpty) {
                                  return null;
                                }
                                if (double.tryParse(v.trim()) == null) {
                                  return 'Introduce un número válido';
                                }
                                return null;
                              },
                            ),
                            DropdownButtonFormField<String>(
                              value: _paymentStatus,
                              decoration: const InputDecoration(
                                labelText: 'Estado de pago',
                                prefixIcon: Icon(Icons.payment_outlined),
                              ),
                              items: const [
                                DropdownMenuItem(
                                  value: 'PENDING',
                                  child: Text('Pendiente'),
                                ),
                                DropdownMenuItem(
                                  value: 'PARTIAL',
                                  child: Text('Pago parcial'),
                                ),
                                DropdownMenuItem(
                                  value: 'PAID',
                                  child: Text('Pagado'),
                                ),
                                DropdownMenuItem(
                                  value: 'REFUNDED',
                                  child: Text('Reembolsado'),
                                ),
                              ],
                              onChanged: (v) => setState(
                                () => _paymentStatus = v ?? 'PENDING',
                              ),
                            ),
                            AdaptiveFormLayout.fullWidth(
                              DropdownButtonFormField<String>(
                                value: _paymentMethod,
                                decoration: const InputDecoration(
                                  labelText: 'Método de pago (opcional)',
                                  prefixIcon: Icon(Icons.credit_card_outlined),
                                ),
                                items: const [
                                  DropdownMenuItem(
                                    value: null,
                                    child: Text('Sin especificar'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'cash',
                                    child: Text('Efectivo'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'transfer',
                                    child: Text('Transferencia'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'mercadopago',
                                    child: Text('MercadoPago'),
                                  ),
                                ],
                                onChanged: (v) =>
                                    setState(() => _paymentMethod = v),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    AdaptiveFormLayout.fullWidth(
                      Padding(
                        padding: const EdgeInsets.only(top: 12, bottom: 16),
                        child: FilledButton.icon(
                          onPressed: _submit,
                          icon: const Icon(Icons.save_outlined),
                          label: Text(
                            _isEdit ? 'Guardar cambios' : 'Crear reserva',
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
