part of 'service_form_page.dart';

extension _ServiceFormShell on _ServiceFormPageState {
  Widget _buildContent(BuildContext context) {
    if (_isEdit) {
      final sid = widget.serviceId!;
      ref.listen<AsyncValue<ServiceDetail>>(serviceDetailProvider(sid), (
        _,
        next,
      ) {
        next.whenData((detail) {
          if (!mounted || _populated || _isDirty) {
            return;
          }
          _populateForm(detail);
          _populated = true;
        });
      });
      ref.watch(serviceDetailProvider(sid));
    }

    return LoadingOverlay(
      isLoading: _loading,
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
            title: Text(_isEdit ? 'Editar servicio' : 'Nuevo servicio'),
            actions: [
              TextButton(
                onPressed: _loading ? null : _submit,
                child: const Text('Guardar'),
              ),
            ],
          ),
          body: Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: _serviceFormListChildren(context),
            ),
          ),
        ),
      ),
    );
  }
}
