import 'package:flutter/material.dart';

import '../../../../core/theme/app_spacing.dart';
import '../../data/service_model.dart';
import 'tier_row_widget.dart';

/// Editable list of pricing tiers for a service.
/// Each tier is a typed [ServicePricingTierItem].
class PricingTiersEditor extends StatefulWidget {
  const PricingTiersEditor({
    super.key,
    required this.tiers,
    required this.onChanged,
  });

  final List<ServicePricingTierItem> tiers;
  final void Function(List<ServicePricingTierItem>) onChanged;

  @override
  State<PricingTiersEditor> createState() => _PricingTiersEditorState();
}

class _PricingTiersEditorState extends State<PricingTiersEditor> {
  late List<ServicePricingTierItem> _tiers;

  @override
  void initState() {
    super.initState();
    _tiers = List<ServicePricingTierItem>.from(widget.tiers);
  }

  void _addTier() {
    setState(() {
      _tiers.add(const ServicePricingTierItem(id: '', name: '', price: ''));
    });
    widget.onChanged(_tiers);
  }

  void _removeTier(int index) {
    setState(() => _tiers.removeAt(index));
    widget.onChanged(_tiers);
  }

  void _updateTier(int index, ServicePricingTierItem updated) {
    setState(() => _tiers[index] = updated);
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
            itemBuilder: (context, i) => TierRowWidget(
              key: ValueKey(i),
              tier: _tiers[i],
              onNameChanged: (v) => _updateTier(i, _tiers[i].copyWith(name: v)),
              onPriceChanged: (v) =>
                  _updateTier(i, _tiers[i].copyWith(price: v)),
              onDescriptionChanged: (v) => _updateTier(
                i,
                _tiers[i].copyWith(
                  description: v.trim().isEmpty ? null : v.trim(),
                ),
              ),
              onRemove: () => _removeTier(i),
            ),
          ),
      ],
    );
  }
}
