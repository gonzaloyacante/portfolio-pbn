import 'package:flutter/material.dart';

import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_spacing.dart';

class DynamicItemList extends StatelessWidget {
  const DynamicItemList({
    super.key,
    required this.controllers,
    required this.focusNodes,
    required this.labelPrefix,
    required this.addLabel,
    required this.onAdd,
    required this.onRemove,
    required this.onSubmit,
  });

  final List<TextEditingController> controllers;
  final List<FocusNode> focusNodes;
  final String labelPrefix;
  final String addLabel;
  final VoidCallback onAdd;
  final ValueChanged<int> onRemove;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (controllers.isNotEmpty)
          LayoutBuilder(
            builder: (context, constraints) {
              final cols = AppBreakpoints.isTablet(context) ? 2 : 1;
              const spacing = AppSpacing.sm;
              final itemWidth =
                  (constraints.maxWidth - spacing * (cols - 1)) / cols;

              return Wrap(
                spacing: spacing,
                runSpacing: AppSpacing.sm,
                children: List.generate(controllers.length, (i) {
                  return SizedBox(
                    width: itemWidth,
                    child: Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: controllers[i],
                            focusNode: focusNodes[i],
                            textInputAction: i < controllers.length - 1
                                ? TextInputAction.next
                                : TextInputAction.done,
                            decoration: InputDecoration(
                              labelText: '$labelPrefix ${i + 1}',
                              border: const OutlineInputBorder(),
                              isDense: true,
                            ),
                            onFieldSubmitted: (_) => onSubmit(),
                          ),
                        ),
                        const SizedBox(width: AppSpacing.xs),
                        IconButton(
                          icon: const Icon(Icons.delete_outline),
                          iconSize: 20,
                          tooltip: 'Eliminar',
                          visualDensity: VisualDensity.compact,
                          onPressed: () => onRemove(i),
                        ),
                      ],
                    ),
                  );
                }),
              );
            },
          ),
        const SizedBox(height: AppSpacing.sm),
        TextButton.icon(
          onPressed: onAdd,
          icon: const Icon(Icons.add, size: 18),
          label: Text(addLabel),
          style: TextButton.styleFrom(visualDensity: VisualDensity.compact),
        ),
      ],
    );
  }
}
