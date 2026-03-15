import 'package:flutter/material.dart';

import '../../../settings/data/settings_model.dart';

class CategorySettingsDialog extends StatefulWidget {
  const CategorySettingsDialog({
    super.key,
    required this.initial,
    required this.onSave,
    this.fullWidth = false,
  });

  final CategoryDisplaySettings initial;
  final Future<void> Function(CategoryDisplaySettings) onSave;
  final bool fullWidth;

  @override
  State<CategorySettingsDialog> createState() => _CategorySettingsDialogState();
}

class _CategorySettingsDialogState extends State<CategorySettingsDialog> {
  late bool _showDescription;
  late bool _showProjectCount;
  late int _gridColumns;
  late bool _isActive;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _showDescription = widget.initial.showDescription;
    _showProjectCount = widget.initial.showProjectCount;
    _gridColumns = widget.initial.gridColumns;
    _isActive = widget.initial.isActive;
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await widget.onSave(
        CategoryDisplaySettings(
          showDescription: _showDescription,
          showProjectCount: _showProjectCount,
          gridColumns: _gridColumns,
          isActive: _isActive,
        ),
      );
      if (mounted) Navigator.of(context).pop();
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudieron guardar los cambios')),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final inset = widget.fullWidth
        ? const EdgeInsets.symmetric(horizontal: 12, vertical: 10)
        : null;
    final contentPadding = widget.fullWidth
        ? const EdgeInsets.symmetric(horizontal: 8)
        : null;

    return AlertDialog(
      insetPadding: inset,
      titlePadding: widget.fullWidth
          ? const EdgeInsets.fromLTRB(16, 18, 16, 0)
          : null,
      contentPadding: contentPadding,
      actionsPadding: widget.fullWidth
          ? const EdgeInsets.fromLTRB(8, 4, 12, 12)
          : null,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(widget.fullWidth ? 12 : 20),
      ),
      title: const Text('Visualización de categorías'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SwitchListTile(
            title: const Text('Sección activa'),
            subtitle: const Text(
              'Controla si la categoría se muestra públicamente',
            ),
            value: _isActive,
            onChanged: (v) => setState(() => _isActive = v),
          ),
          SwitchListTile(
            title: const Text('Mostrar descripción'),
            subtitle: const Text(
              'Muestra el texto descriptivo en cada tarjeta',
            ),
            value: _showDescription,
            onChanged: (v) => setState(() => _showDescription = v),
          ),
          SwitchListTile(
            title: const Text('Mostrar cantidad de proyectos'),
            subtitle: const Text('Número de proyectos en cada categoría'),
            value: _showProjectCount,
            onChanged: (v) => setState(() => _showProjectCount = v),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Columnas en el grid',
                  style: TextStyle(fontSize: 14),
                ),
              ),
              DropdownButton<int>(
                value: _gridColumns,
                items: [1, 2, 3, 4, 5]
                    .map((n) => DropdownMenuItem(value: n, child: Text('$n')))
                    .toList(),
                onChanged: (v) {
                  if (v != null) setState(() => _gridColumns = v);
                },
              ),
            ],
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: _saving ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: _saving ? null : _save,
          child: _saving
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Guardar'),
        ),
      ],
    );
  }
}
