import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../providers/dashboard_provider.dart';
import 'widgets/dashboard_charts.dart';
import 'widgets/dashboard_greeting.dart';
import 'widgets/device_usage_section.dart';
import 'widgets/top_ranking_section.dart';
import 'widgets/visitors_map.dart';
part 'dashboard_page_builders.dart';

// ── DashboardPage ─────────────────────────────────────────────────────────────

/// Pantalla principal del panel de administración.
///
/// Cada sección maneja su propio estado de carga (skeleton/error/data)
/// de forma independiente. Pull-to-refresh recarga todos los providers.
class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  String _formatNumber(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}k';
    return n.toString();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) => _buildBody(context, ref);
}
