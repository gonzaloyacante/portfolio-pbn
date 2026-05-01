import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../features/app_settings/providers/app_preferences_provider.dart';
import '../../../core/api/upload_service.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/categories_repository.dart';
import '../data/category_model.dart';
import 'widgets/gallery_image_viewer.dart';
import 'widgets/gallery_list_view.dart';
import 'widgets/gallery_grid_view.dart';
import 'widgets/gallery_skeleton.dart';
import 'widgets/gallery_tile.dart';
import 'widgets/gallery_upload_fab.dart';

part 'category_gallery_page_widgets.dart';
part 'category_gallery_page_builders.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

final _categoryGalleryProvider =
    FutureProvider.family<List<GalleryImageItem>, String>(
      (Ref ref, String categoryId) =>
          ref.read(categoriesRepositoryProvider).getCategoryGallery(categoryId),
    );

// ── Page ──────────────────────────────────────────────────────────────────────

class CategoryGalleryPage extends ConsumerStatefulWidget {
  const CategoryGalleryPage({
    super.key,
    required this.categoryId,
    required this.categoryName,
  });

  final String categoryId;
  final String categoryName;

  @override
  ConsumerState<CategoryGalleryPage> createState() =>
      _CategoryGalleryPageState();
}

class _CategoryGalleryPageState extends ConsumerState<CategoryGalleryPage> {
  /// Estado local del orden mientras el usuario arrastra.
  List<GalleryImageItem>? _items;
  bool _dirty = false;
  bool _saving = false;
  bool _uploading = false;
  String _searchQuery = '';

  /// ID del ítem actualmente arrastrado en la vista de cuadrícula.
  String? _draggingId;

  /// ID del ítem que acaba de ser soltado — activa la animación de drop.
  String? _lastDroppedId;

  void _rebuild(VoidCallback fn) => setState(fn);

  void _onSearch(String value) => setState(() => _searchQuery = value.trim());

  Future<void> _onRefresh() async {
    setState(() {
      _items = null;
      _dirty = false;
    });
    ref.invalidate(_categoryGalleryProvider(widget.categoryId));
    await ref.read(_categoryGalleryProvider(widget.categoryId).future);
  }

  List<GalleryImageItem> get _displayItems {
    if (_items == null) return const [];
    if (_searchQuery.isEmpty) return _items!;
    final query = _searchQuery.toLowerCase();
    return _items!
        .where((img) => img.publicId?.toLowerCase().contains(query) ?? false)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final galleryAsync = ref.watch(_categoryGalleryProvider(widget.categoryId));

    ref.listen<AsyncValue<List<GalleryImageItem>>>(
      _categoryGalleryProvider(widget.categoryId),
      (_, next) {
        next.whenData((images) {
          if (!mounted) return;
          if (_items == null) {
            setState(() {
              _items = List.of(images);
              _dirty = false;
            });
            return;
          }
          if (!_dirty) {
            setState(() => _items = List.of(images));
          }
        });
      },
    );

    final viewMode = ref.watch(categoryGalleryViewModeProvider);

    return AppScaffold(
      title: 'Galería — ${widget.categoryName}',
      floatingActionButton: _buildFAB(context),
      actions: _buildActions(context, viewMode),
      body: _buildBody(context, galleryAsync, viewMode),
    );
  }
}
