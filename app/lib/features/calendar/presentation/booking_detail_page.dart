// ignore_for_file: use_null_aware_elements

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/router/route_names.dart';
import '../../../core/utils/currency_helper.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/booking_model.dart';
import '../providers/calendar_provider.dart';
import 'widgets/google_calendar_section.dart';
import 'widgets/info_row.dart';
import 'widgets/section_card.dart';

part 'booking_detail_page_builders.dart';
part 'booking_detail_page_actions.dart';

class BookingDetailPage extends ConsumerStatefulWidget {
  const BookingDetailPage({super.key, required this.bookingId});

  final String bookingId;

  @override
  ConsumerState<BookingDetailPage> createState() => _BookingDetailPageState();
}

class _BookingDetailPageState extends ConsumerState<BookingDetailPage> {
  bool _saving = false;
  String? _status;
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _populate(BookingDetail detail) {
    if (_status != null) return; // ya inicializado
    _status = detail.status;
    _notesController.text = detail.adminNotes ?? '';
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  void _rebuild(VoidCallback fn) => setState(fn);

  @override
  Widget build(BuildContext context) => _buildContent(context);
}
