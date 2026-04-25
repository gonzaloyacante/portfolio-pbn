import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../shared/widgets/widgets.dart';
import '../../data/service_model.dart';

/// A single editable row for a [ServicePricingTierItem] inside [PricingTiersEditor].
class TierRowWidget extends StatelessWidget {
  const TierRowWidget({
    super.key,
    required this.tier,
    required this.onNameChanged,
    required this.onPriceChanged,
    required this.onDescriptionChanged,
    required this.onRemove,
  });

  final ServicePricingTierItem tier;
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
                          initialValue: tier.name,
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
                          initialValue: tier.price,
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
                    initialValue: tier.description ?? '',
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
