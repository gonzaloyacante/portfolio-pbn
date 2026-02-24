import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/api/upload_service.dart';
import '../../../shared/widgets/image_upload_widget.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../data/service_model.dart';
import '../data/services_repository.dart';
import '../providers/services_provider.dart';

// Patrones de slug compilados una sola vez
// ignore: deprecated_member_use
final _reServiceWhitespace = RegExp(r'\s+');
// ignore: deprecated_member_use
final _reServiceNonSlug = RegExp(r'[^a-z0-9-]');
// ignore: deprecated_member_use
final _reServiceSlugValid = RegExp(r'^[a-z0-9-]+$');

class ServiceFormPage extends ConsumerStatefulWidget {
  const ServiceFormPage({super.key, this.serviceId});

  final String? serviceId;

  @override
  ConsumerState<ServiceFormPage> createState() => _ServiceFormPageState();
}

class _ServiceFormPageState extends ConsumerState<ServiceFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _slugCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _shortDescCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _durationCtrl = TextEditingController();
  final _imageCtrl = TextEditingController();
  File? _pendingImage;
  final _iconCtrl = TextEditingController();
  final _colorCtrl = TextEditingController();

  String _priceLabel = 'desde';
  String _currency = 'ARS';
  bool _isActive = true;
  bool _isFeatured = false;
  bool _loading = false;
  bool _populated = false;

  bool get _isEdit => widget.serviceId != null;

  @override
  void dispose() {
    for (final ctrl in [
      _nameCtrl,
      _slugCtrl,
      _descCtrl,
      _shortDescCtrl,
      _priceCtrl,
      _durationCtrl,
      _imageCtrl,
      _iconCtrl,
      _colorCtrl,
    ]) {
      ctrl.dispose();
    }
    super.dispose();
  }

  void _populateForm(ServiceDetail detail) {
    if (_populated) return;
    _populated = true;
    _nameCtrl.text = detail.name;
    _slugCtrl.text = detail.slug;
    _descCtrl.text = detail.description ?? '';
    _shortDescCtrl.text = detail.shortDesc ?? '';
    _priceCtrl.text = detail.price ?? '';
    _durationCtrl.text = detail.duration ?? '';
    _imageCtrl.text = detail.imageUrl ?? '';
    _iconCtrl.text = detail.iconName ?? '';
    _colorCtrl.text = detail.color ?? '';
    setState(() {
      _priceLabel = detail.priceLabel ?? 'desde';
      _currency = detail.currency;
      _isActive = detail.isActive;
      _isFeatured = detail.isFeatured;
    });
  }

  void _autoSlug(String name) {
    if (_isEdit) return;
    final slug = name
        .toLowerCase()
        .replaceAll(_reServiceWhitespace, '-')
        .replaceAll(_reServiceNonSlug, '');
    _slugCtrl.text = slug;
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      // Subir imagen si se seleccionó una nueva.
      if (_pendingImage != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        _imageCtrl.text = await uploadSvc.uploadImage(
          _pendingImage!,
          folder: 'portfolio/services',
        );
      }

      final repo = ref.read(servicesRepositoryProvider);
      final formData = ServiceFormData(
        name: _nameCtrl.text.trim(),
        slug: _slugCtrl.text.trim(),
        description: _descCtrl.text.trim().isEmpty
            ? null
            : _descCtrl.text.trim(),
        shortDesc: _shortDescCtrl.text.trim().isEmpty
            ? null
            : _shortDescCtrl.text.trim(),
        price: _priceCtrl.text.trim().isEmpty ? null : _priceCtrl.text.trim(),
        priceLabel: _priceLabel,
        currency: _currency,
        duration: _durationCtrl.text.trim().isEmpty
            ? null
            : _durationCtrl.text.trim(),
        imageUrl: _imageCtrl.text.trim().isEmpty
            ? null
            : _imageCtrl.text.trim(),
        iconName: _iconCtrl.text.trim().isEmpty ? null : _iconCtrl.text.trim(),
        color: _colorCtrl.text.trim().isEmpty ? null : _colorCtrl.text.trim(),
        isActive: _isActive,
        isFeatured: _isFeatured,
      );

      if (_isEdit) {
        await repo.updateService(widget.serviceId!, formData.toJson());
        ref.invalidate(serviceDetailProvider(widget.serviceId!));
      } else {
        await repo.createService(formData);
      }

      ref.invalidate(servicesListProvider);
      if (mounted) context.pop();
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'No se pudo guardar el servicio. Inténtalo de nuevo.',
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isEdit) {
      final detailAsync = ref.watch(serviceDetailProvider(widget.serviceId!));
      detailAsync.whenData(_populateForm);
    }

    return LoadingOverlay(
      isLoading: _loading,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
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
            children: [
              // Nombre
              TextFormField(
                controller: _nameCtrl,
                decoration: const InputDecoration(labelText: 'Nombre *'),
                textCapitalization: TextCapitalization.words,
                onChanged: _autoSlug,
                validator: (v) =>
                    (v == null || v.trim().isEmpty) ? 'Nombre requerido' : null,
              ),
              const SizedBox(height: 16),

              // Slug
              TextFormField(
                controller: _slugCtrl,
                decoration: const InputDecoration(
                  labelText: 'Slug *',
                  prefixText: '/',
                ),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return 'Slug requerido';
                  if (!_reServiceSlugValid.hasMatch(v.trim())) {
                    return 'Solo minúsculas, números y guiones';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Descripción corta
              TextFormField(
                controller: _shortDescCtrl,
                decoration: const InputDecoration(
                  labelText: 'Descripción corta',
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 16),

              // Descripción larga
              TextFormField(
                controller: _descCtrl,
                decoration: const InputDecoration(
                  labelText: 'Descripción detallada',
                ),
                maxLines: 4,
              ),
              const SizedBox(height: 16),

              // Precio + etiqueta
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _priceCtrl,
                      decoration: const InputDecoration(labelText: 'Precio'),
                      keyboardType: const TextInputType.numberWithOptions(
                        decimal: true,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  SizedBox(
                    width: 110,
                    child: DropdownButtonFormField<String>(
                      initialValue: _priceLabel,
                      decoration: const InputDecoration(labelText: 'Tipo'),
                      items: const [
                        DropdownMenuItem(value: 'desde', child: Text('desde')),
                        DropdownMenuItem(value: 'fijo', child: Text('fijo')),
                        DropdownMenuItem(
                          value: 'consultar',
                          child: Text('consultar'),
                        ),
                        DropdownMenuItem(
                          value: 'gratis',
                          child: Text('gratis'),
                        ),
                      ],
                      onChanged: (v) =>
                          setState(() => _priceLabel = v ?? 'desde'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Duración
              TextFormField(
                controller: _durationCtrl,
                decoration: const InputDecoration(
                  labelText: 'Duración',
                  hintText: 'ej. 2 horas, Todo el día',
                ),
              ),
              const SizedBox(height: 16),

              // Ícono + Color
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _iconCtrl,
                      decoration: const InputDecoration(labelText: 'Ícono'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      controller: _colorCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Color',
                        hintText: '#6C0A0A',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Imagen del servicio
              ImageUploadWidget(
                label: 'Imagen del servicio',
                currentImageUrl: _imageCtrl.text.isNotEmpty
                    ? _imageCtrl.text
                    : null,
                onImageSelected: (file) {
                  setState(() => _pendingImage = file);
                },
                onImageRemoved: () {
                  setState(() {
                    _pendingImage = null;
                    _imageCtrl.clear();
                  });
                },
                height: 160,
              ),
              const SizedBox(height: 16),

              // Switches
              SwitchListTile(
                title: const Text('Servicio activo'),
                value: _isActive,
                onChanged: (v) => setState(() => _isActive = v),
              ),
              SwitchListTile(
                title: const Text('Destacado'),
                value: _isFeatured,
                onChanged: (v) => setState(() => _isFeatured = v),
              ),
              const SizedBox(height: 32),

              FilledButton(
                onPressed: _loading ? null : _submit,
                child: Text(_isEdit ? 'Actualizar servicio' : 'Crear servicio'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
