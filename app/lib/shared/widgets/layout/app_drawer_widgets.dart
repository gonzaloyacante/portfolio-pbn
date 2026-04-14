part of 'app_drawer.dart';

// ── Sub-widgets del Drawer ────────────────────────────────────────────────────

class _DrawerHeader extends StatelessWidget {
  const _DrawerHeader({required this.textTheme, required this.colorScheme});

  final TextTheme textTheme;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(
        AppSpacing.base,
        AppSpacing.xl + MediaQuery.paddingOf(context).top,
        AppSpacing.base,
        AppSpacing.lg,
      ),
      child: Row(
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  colorScheme.primary,
                  colorScheme.primary.withValues(alpha: 0.75),
                ],
              ),
              borderRadius: AppRadius.forIconContainer,
              boxShadow: [
                BoxShadow(
                  color: colorScheme.primary.withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Center(
              child: Text(
                'P',
                style: AppTypography.decorativeTitle(
                  Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Paola BN',
                  style: textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 3),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.sm - 1,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: colorScheme.primary.withValues(alpha: 0.12),
                    borderRadius: const BorderRadius.circular(6),
                  ),
                  child: Text(
                    'Admin',
                    style: textTheme.labelSmall?.copyWith(
                      color: colorScheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 4),
      child: Text(
        label,
        style: Theme.of(context).textTheme.labelLarge?.copyWith(
          color: Theme.of(context).colorScheme.primary,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

class _DrawerExpandableItem extends StatefulWidget {
  const _DrawerExpandableItem({
    required this.item,
    required this.isSelected,
    required this.isExpanded,
    required this.currentRoute,
    required this.onChildTap,
    required this.onTap,
  });

  final NavItem item;
  final bool isSelected;
  final bool isExpanded;
  final String currentRoute;
  final void Function(NavItem child) onChildTap;
  final VoidCallback onTap;

  @override
  State<_DrawerExpandableItem> createState() => _DrawerExpandableItemState();
}

class _DrawerExpandableItemState extends State<_DrawerExpandableItem>
    with SingleTickerProviderStateMixin {
  late bool _expanded;
  late AnimationController _iconCtrl;

  @override
  void initState() {
    super.initState();
    _expanded = widget.isSelected;
    _iconCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
      value: _expanded ? 1.0 : 0.0,
    );
  }

  @override
  void didUpdateWidget(covariant _DrawerExpandableItem old) {
    super.didUpdateWidget(old);
    if (widget.isSelected && !_expanded) {
      _expanded = true;
      _iconCtrl.forward();
    }
  }

  @override
  void dispose() {
    _iconCtrl.dispose();
    super.dispose();
  }

  void _toggle() {
    setState(() => _expanded = !_expanded);
    if (_expanded) {
      _iconCtrl.forward();
    } else {
      _iconCtrl.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ListTile(
          dense: true,
          shape: const RoundedRectangleBorder(borderRadius: AppRadius.forTile),
          selected: widget.isSelected,
          selectedTileColor: colorScheme.primaryContainer.withValues(
            alpha: 0.5,
          ),
          leading: Icon(
            widget.isSelected ? widget.item.selectedIcon : widget.item.icon,
            color: widget.isSelected
                ? colorScheme.primary
                : colorScheme.onSurfaceVariant,
            size: 22,
          ),
          title: Text(
            widget.item.label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: widget.isSelected
                  ? colorScheme.primary
                  : colorScheme.onSurface,
              fontWeight: widget.isSelected
                  ? FontWeight.w600
                  : FontWeight.normal,
            ),
          ),
          trailing: RotationTransition(
            turns: Tween(begin: 0.0, end: 0.5).animate(
              CurvedAnimation(parent: _iconCtrl, curve: Curves.easeInOut),
            ),
            child: Icon(
              Icons.expand_more,
              size: 20,
              color: colorScheme.onSurfaceVariant,
            ),
          ),
          onTap: _toggle,
        ),
        AnimatedCrossFade(
          firstChild: const SizedBox.shrink(),
          secondChild: Padding(
            padding: const EdgeInsets.only(left: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: widget.item.children.map((child) {
                final childSelected = child.routeName == widget.currentRoute;
                return ListTile(
                  dense: true,
                  visualDensity: const VisualDensity(vertical: -3),
                  shape: RoundedRectangleBorder(
                    borderRadius: AppRadius.forTile,
                  ),
                  selected: childSelected,
                  selectedTileColor: colorScheme.primaryContainer.withValues(
                    alpha: 0.3,
                  ),
                  leading: Icon(
                    childSelected ? child.selectedIcon : child.icon,
                    color: childSelected
                        ? colorScheme.primary
                        : colorScheme.onSurfaceVariant,
                    size: 18,
                  ),
                  title: Text(
                    child.label,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: childSelected
                          ? colorScheme.primary
                          : colorScheme.onSurface,
                      fontWeight: childSelected
                          ? FontWeight.w600
                          : FontWeight.normal,
                    ),
                  ),
                  onTap: () => widget.onChildTap(child),
                );
              }).toList(),
            ),
          ),
          crossFadeState: _expanded
              ? CrossFadeState.showSecond
              : CrossFadeState.showFirst,
          duration: const Duration(milliseconds: 200),
        ),
      ],
    );
  }
}

class _DrawerNavItem extends StatelessWidget {
  const _DrawerNavItem({
    required this.item,
    required this.isSelected,
    required this.isExpanded,
    required this.onTap,
    this.badgeCount = 0,
  });

  final NavItem item;
  final bool isSelected;
  final bool isExpanded;
  final VoidCallback onTap;
  final int badgeCount;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return ListTile(
      dense: true,
      shape: const RoundedRectangleBorder(borderRadius: AppRadius.forTile),
      selected: isSelected,
      selectedTileColor: colorScheme.primaryContainer.withValues(alpha: 0.5),
      leading: Icon(
        isSelected ? item.selectedIcon : item.icon,
        color: isSelected ? colorScheme.primary : colorScheme.onSurfaceVariant,
        size: 22,
      ),
      title: Text(
        item.label,
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: isSelected ? colorScheme.primary : colorScheme.onSurface,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
        ),
      ),
      trailing: badgeCount > 0
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
              decoration: BoxDecoration(
                color: colorScheme.primary,
                borderRadius: const BorderRadius.circular(10),
              ),
              child: Text(
                badgeCount > 99 ? '99+' : badgeCount.toString(),
                style: Theme.of(context).textTheme.labelMedium?.copyWith(
                  color: colorScheme.onPrimary,
                  fontWeight: FontWeight.w600,
                  fontSize: 11,
                ),
              ),
            )
          : null,
      onTap: onTap,
    );
  }
}
