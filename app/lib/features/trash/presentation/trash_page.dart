// ignore_for_file: use_null_aware_elements
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/utils/app_logger.dart';

import '../../../core/router/route_names.dart';
import '../../../shared/widgets/widgets.dart';
import '../../calendar/providers/calendar_provider.dart';
import '../../categories/providers/categories_provider.dart';
import '../../contacts/providers/contacts_provider.dart';
import '../../services/providers/services_provider.dart';
import '../../testimonials/providers/testimonials_provider.dart';
import '../data/trash_model.dart';
import '../providers/trash_provider.dart';
import 'widgets/trash_section.dart';
part 'trash_page_builders.dart';

class TrashPage extends ConsumerStatefulWidget {
  const TrashPage({super.key});

  @override
  ConsumerState<TrashPage> createState() => _TrashPageState();
}

class _TrashPageState extends ConsumerState<TrashPage> {
  String _searchQuery = '';

  void _onSearch(String value) => setState(() => _searchQuery = value.trim());

  @override
  Widget build(BuildContext context) {
    final trashAsync = ref.watch(trashItemsProvider);

    return AppScaffold(
      title: 'Papelera',
      body: trashAsync.when(
        loading: () => const SkeletonTrashList(),
        error: (e, _) => ErrorState(
          message: e.toString(),
          onRetry: () => ref.invalidate(trashItemsProvider),
        ),
        data: (grouped) => _buildContent(context, grouped),
      ),
    );
  }
}
