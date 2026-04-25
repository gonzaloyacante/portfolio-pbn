import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/debug/debug_provider.dart';
import 'widgets/help_content.dart';

/// Pantalla de ayuda — información de la app y guía de uso básica.
class HelpPage extends ConsumerWidget {
  const HelpPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final version = ref
        .watch(appBuildInfoProvider)
        .when(
          data: (info) => '${info.version} (build ${info.buildNumber})',
          loading: () => '…',
          error: (_, _) => '—',
        );
    return AppScaffold(
      title: 'Ayuda',
      body: HelpContent(version: version),
    );
  }
}
