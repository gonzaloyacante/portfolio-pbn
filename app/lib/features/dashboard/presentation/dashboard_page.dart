import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/dashboard_repository.dart';
import '../providers/dashboard_provider.dart';
import 'widgets/dashboard_greeting.dart';
import 'widgets/dashboard_priority_section.dart';
import 'widgets/dashboard_quick_actions.dart';
import 'widgets/dashboard_stats_grid.dart';
import 'widgets/dashboard_traffic_info.dart';
part 'dashboard_page_builders.dart';

// ── DashboardPage ─────────────────────────────────────────────────────────────

/// Pantalla principal del panel de administración.
///
/// Cada sección maneja su propio estado de carga (skeleton/error/data)
/// de forma independiente. Pull-to-refresh recarga todos los providers.
class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) => _buildBody(context, ref);
}
