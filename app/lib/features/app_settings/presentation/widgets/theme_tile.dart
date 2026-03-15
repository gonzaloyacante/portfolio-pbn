import 'package:flutter/material.dart';

class ThemeTile extends StatelessWidget {
  const ThemeTile({
    super.key,
    required this.label,
    required this.icon,
    required this.mode,
    required this.current,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final ThemeMode mode;
  final ThemeMode current;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isSelected = mode == current;
    final colorScheme = Theme.of(context).colorScheme;

    return ListTile(
      dense: true,
      visualDensity: VisualDensity.compact,
      contentPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
      leading: Icon(icon, color: isSelected ? colorScheme.primary : null),
      title: Text(
        label,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          color: isSelected ? colorScheme.primary : null,
        ),
      ),
      trailing: isSelected
          ? Icon(Icons.check_circle, color: colorScheme.primary)
          : const SizedBox.shrink(),
      onTap: onTap,
    );
  }
}
