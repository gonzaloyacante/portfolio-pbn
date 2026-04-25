import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/contact_model.dart';
import '../providers/contacts_provider.dart';
import 'widgets/contact_tile.dart';
import 'widgets/contacts_list_header.dart';

part 'contacts_list_page_builders.dart';

class ContactsListPage extends ConsumerStatefulWidget {
  const ContactsListPage({super.key});

  @override
  ConsumerState<ContactsListPage> createState() => _ContactsListPageState();
}

class _ContactsListPageState extends ConsumerState<ContactsListPage> {
  final _searchController = TextEditingController();
  String _search = '';
  String? _statusFilter;
  bool _unreadOnly = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String value) => setState(() => _search = value.trim());

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(
      contactsListProvider(
        search: _search.isEmpty ? null : _search,
        status: _statusFilter,
        unreadOnly: _unreadOnly ? true : null,
      ),
    );
    final hPad = AppBreakpoints.pageMargin(context);

    return AppScaffold(
      title: 'Contactos',
      body: PaginatedListView<ContactItem>(
        asyncValue: async,
        loadingWidget: const SkeletonContactsList(),
        emptyState: const EmptyState(
          icon: Icons.mail_outline,
          title: 'Sin mensajes',
          subtitle: 'Aquí aparecen los mensajes del formulario de contacto',
        ),
        onRetry: () => ref.invalidate(contactsListProvider),
        onRefresh: () async => ref.invalidate(contactsListProvider),
        headerWidget: ContactsListHeader(
          controller: _searchController,
          onSearch: _onSearch,
          statusFilter: _statusFilter,
          unreadOnly: _unreadOnly,
          hPad: hPad,
          onFilterChanged: (s) => setState(() {
            if (s == 'UNREAD') {
              _unreadOnly = true;
              _statusFilter = null;
            } else {
              _unreadOnly = false;
              _statusFilter = s;
            }
          }),
        ),
        dataBuilder: (items) => _buildList(items, hPad),
      ),
    );
  }
}
