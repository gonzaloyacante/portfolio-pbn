// ignore_for_file: use_null_aware_elements

import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/shared/models/api_response.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';

import 'testimonial_model.dart';

class TestimonialsRepository {
  final ApiClient _client;

  const TestimonialsRepository(this._client);

  Future<PaginatedResponse<TestimonialItem>> getTestimonials({
    int page = 1,
    int limit = 50,
    String? search,
    String? status,
    bool? isFeatured,
    bool? isActive,
  }) async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.testimonials,
      queryParams: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
        if (status != null) 'status': status,
        if (isFeatured != null) 'featured': isFeatured.toString(),
        if (isActive != null) 'active': isActive.toString(),
      },
    );

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return PaginatedResponse<TestimonialItem>.fromJson(
      apiResp.data!,
      (e) => TestimonialItem.fromJson(e as Map<String, dynamic>),
    );
  }

  Future<TestimonialDetail> getTestimonial(String id) async {
    final resp = await _client.get<Map<String, dynamic>>(Endpoints.testimonial(id));

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return TestimonialDetail.fromJson(apiResp.data!);
  }

  Future<TestimonialDetail> createTestimonial(TestimonialFormData data) async {
    final resp = await _client.post<Map<String, dynamic>>(Endpoints.testimonials, data: data.toJson());

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return TestimonialDetail.fromJson(apiResp.data!);
  }

  Future<TestimonialDetail> updateTestimonial(String id, Map<String, dynamic> updates) async {
    final resp = await _client.patch<Map<String, dynamic>>(Endpoints.testimonial(id), data: updates);

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return TestimonialDetail.fromJson(apiResp.data!);
  }

  Future<void> deleteTestimonial(String id) async {
    await _client.delete<Map<String, dynamic>>(Endpoints.testimonial(id));
  }
}
