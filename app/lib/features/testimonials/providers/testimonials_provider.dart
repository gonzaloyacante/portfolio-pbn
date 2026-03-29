import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:portfolio_pbn/shared/models/paginated_response.dart';

import '../data/testimonial_model.dart';
import '../data/testimonials_repository.dart';

// Re-export the repository provider so pages that import this file can access
// testimonialsRepositoryProvider without an additional import.
export '../data/testimonials_repository.dart'
    show testimonialsRepositoryProvider;

part 'testimonials_provider.g.dart';

// ── Lista ─────────────────────────────────────────────────────────────────────

@riverpod
Future<PaginatedResponse<TestimonialItem>> testimonialsList(
  Ref ref, {
  int page = 1,
  String? search,
  String? status,
  bool? isFeatured,
}) async {
  ref.keepAlive();
  return ref
      .watch(testimonialsRepositoryProvider)
      .getTestimonials(
        page: page,
        search: search,
        status: status,
        isFeatured: isFeatured,
      );
}

// ── Detalle ───────────────────────────────────────────────────────────────────

@riverpod
Future<TestimonialDetail> testimonialDetail(Ref ref, String id) async {
  ref.keepAlive();
  return ref.watch(testimonialsRepositoryProvider).getTestimonial(id);
}
