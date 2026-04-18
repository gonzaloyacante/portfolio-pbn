import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/utils/app_logger.dart';
import '../../../core/theme/app_colors.dart';

import '../../calendar/providers/calendar_provider.dart';
import '../../categories/providers/categories_provider.dart';
import '../../contacts/providers/contacts_provider.dart';
import '../../services/providers/services_provider.dart';
import '../../testimonials/providers/testimonials_provider.dart';
import '../data/trash_model.dart';
import '../providers/trash_provider.dart';
import 'widgets/trash_hero_card.dart';
import 'widgets/trash_deletion_card.dart';
import 'widgets/trash_item_actions.dart';

part 'trash_field_defs.dart';
part 'trash_item_detail_builders.dart';

// ── Pantalla de detalle ────────────────────────────────────────────────────────

class TrashItemDetailPage extends ConsumerWidget {
  const TrashItemDetailPage({super.key, required this.item});

  final TrashItem item;

  static final _dateFmt = DateFormat("d 'de' MMMM yyyy, HH:mm", 'es');

  @override
  Widget build(BuildContext context, WidgetRef ref) => AppScaffold(
    title: trashTypeLabel(item.type),
    body: _buildBody(context, ref),
  );
}
