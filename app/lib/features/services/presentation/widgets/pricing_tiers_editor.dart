import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../shared/widgets/widgets.dart';

/// Editable list of pricing tiers for a service.
/// Each tier has a `name`, `price` and optional `description`.
class PricingTiersEditor extends StatefulWidget {
  const PricingTiersEditor({
    super.key,
    required this.tiers,
    required this.onChanged,
  });

  final List<Map<String, dynamic>> tiers;
  final void Function(List<Map<String, dynamic>>) onChanged;

  @override
  State<PricingTiersEditor> createState() => _PricingTiersEditorState();
}

class _PricingTiersEditorState extends State<PricingTiersEditor> {
  late List<Map<String, dynamic>> _tiers;

  @override
  void initState() {
    super.initState();
    _tiers = List<Map<String, dynamic>>.from(
      widget.tiers.map((t) => Map<String, dynamic>.from(t)),
    );
  }

  void _addTier() {
    setState(() {
      _tiers.add({'name': '', 'price': '', 'description': ''});
    });
    widget.onChanged(_tiers);
  }

  void _removeTier(int index) {
    setState(() => _tiers.removeAt(index));
    widget.onChanged(_tiers);
  }

  void _updateTier(int index, String field, String value) {
    _tiers[index] = Map<String, dynamic>.from(_tiers[index])..[field] = value;
    widget.onChanged(_tiers);
  }

  void _reorder(int oldIndex, int newIndex) {
    if (newIndex > oldIndex) newIndex--;
    setState(() {
      final item = _tiers.removeAt(oldIndex);
      _tiers.insert(newIndex, item);
    });
    widget.onChanged(_tiers);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Tarifas / Tiers de precio',
              style: Theme.of(
                context,
              ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const Spacer(),
            TextButton.icon(
              onPressed: _addTier,
              icon: const Icon(Icons.add, size: 18),
              label: const Text('Añadir'),
            ),
          ],
        ),
        if (_tiers.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
            child: Text(
              'Sin tarifas definidas. Pulsa "Añadir" para crear una.',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Theme.of(context).colorScheme.outline,
              ),
            ),
          )
        else
          ReorderableListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _tiers.length,
            onReorder: _reorder,
            itemBuilder: (context, i) => _TierRow(
              key: ValueKey(i),
              tier: _tiers[i],
              onNameChanged: (v) => _updateTier(i, 'name', v),
              onPriceChanged: (v) => _updateTier(i, 'price', v),
              onDescriptionChanged: (v) => _updateTier(i, 'description', v),
              onRemove: () => _removeTier(i),
            ),
          ),
      ],
    );
  }
}

class _TierRow extends StatelessWidget {
  const _TierRow({
    super.key,
    required this.tier,
    required this.onNameChanged,
    required this.onPriceChanged,
    required this.onDescriptionChanged,
    required this.onRemove,
  });

  final Map<String, dynamic> tier;
  final void Function(String) onNameChanged;
  final void Function(String) onPriceChanged;
  final void Function(String) onDescriptionChanged;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: AppCard(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.drag_handle, color: AppColors.neutral),
            const SizedBox(width: AppSpacing.xs),
            Expanded(
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        flex: 3,
                        child: TextFormField(
                          initialValue: tier['name']?.toString() ?? '',
                          decoration: const InputDecoration(
                            labelText: 'Nombre',
                            isDense: true,
                          ),
                          onChanged: onNameChanged,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Expanded(
                        flex: 2,
                        child: TextFormField(
                          initialValue: tier['price']?.toString() ?? '',
                          decoration: const InputDecoration(
                            labelText: 'Precio',
                            isDense: true,
                          ),
                          keyboardType: const TextInputType.numberWithOptions(
                            decimal: true,
                          ),
                          onChanged: onPriceChanged,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  TextFormField(
                    initialValue: tier['description']?.toString() ?? '',
                    decoration: const InputDecoration(
                      labelText: 'Descripción (opcional)',
                      isDense: true,
                    ),
                    onChanged: onDescriptionChanged,
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: onRemove,
              icon: const Icon(
                Icons.close,
                color: AppColors.destructive,
                size: 18,
              ),
              tooltip: 'Eliminar tier',
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
          ],
        ),
      ),
    );
  }
}
