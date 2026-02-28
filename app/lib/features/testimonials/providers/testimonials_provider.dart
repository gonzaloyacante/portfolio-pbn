import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';

import '../data/testimonial_model.dart';
import '../data/testimonials_repository.dart';

part 'testimonials_provider.g.dart';

// ── Repositorio ───────────────────────────────────────────────────────────────

@riverpod
TestimonialsRepository testimonialsRepository(Ref ref) {
  return TestimonialsRepository(ref.watch(apiClientProvider));
}

// ── Lista ─────────────────────────────────────────────────────────────────────

@riverpod
Future<PaginatedResponse<TestimonialItem>> testimonialsList(
  Ref ref, {
  int page = 1,
  String? search,
  String? status,
  bool? isFeatured,
}) async {
  return ref
      .watch(testimonialsRepositoryProvider)
      .getTestimonials(page: page, search: search, status: status, isFeatured: isFeatured);
}

// ── Detalle ───────────────────────────────────────────────────────────────────

@riverpod
Future<TestimonialDetail> testimonialDetail(Ref ref, String id) async {
  return ref.watch(testimonialsRepositoryProvider).getTestimonial(id);
}
