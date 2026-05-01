part of 'booking_form_page.dart';

extension _BookingFormSelect on _BookingFormPageState {
  Widget _buildServiceSelector() {
    final servicesAsync = ref.watch(servicesListProvider());
    return servicesAsync.when(
      loading: () => const ShimmerBox(
        width: double.infinity,
        height: 56,
        borderRadius: 12,
      ),
      error: (err, _) => ErrorState.forFailure(
        err,
        fallbackMessage: 'No se pudieron cargar los servicios',
        onRetry: () => ref.invalidate(servicesListProvider()),
      ),
      data: (paginated) {
        final services = paginated.data;
        if (services.isEmpty) {
          return const Text('No hay servicios disponibles');
        }
        return DropdownButtonFormField<String>(
          value: _serviceId,
          decoration: const InputDecoration(
            labelText: 'Servicio *',
            hintText: 'Selecciona un servicio',
          ),
          isExpanded: true,
          items: services
              .map(
                (s) => DropdownMenuItem(
                  value: s.id,
                  child: Text(s.name, overflow: TextOverflow.ellipsis),
                ),
              )
              .toList(),
          onChanged: (v) => setState(() => _serviceId = v),
          validator: (v) => v == null ? 'Selecciona un servicio' : null,
        );
      },
    );
  }
}
