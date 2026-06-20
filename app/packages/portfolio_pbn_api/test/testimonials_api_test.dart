import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for TestimonialsApi
void main() {
  final instance = PortfolioPbnApi().getTestimonialsApi();

  group(TestimonialsApi, () {
    // Crea un testimonio
    //
    //Future<TestimonialDetail> createTestimonial({ CreateTestimonialRequest createTestimonialRequest }) async
    test('test createTestimonial', () async {
      // TODO
    });

    // Elimina un testimonio (soft delete)
    //
    //Future<DeleteTestimonialResponse> deleteTestimonial(String id) async
    test('test deleteTestimonial', () async {
      // TODO
    });

    // Obtiene un testimonio por ID
    //
    //Future<TestimonialDetail> getTestimonial(String id) async
    test('test getTestimonial', () async {
      // TODO
    });

    // Lista testimonios (admin)
    //
    //Future<TestimonialList> listTestimonials({ num page, num limit, String search, String status, String featured, String active }) async
    test('test listTestimonials', () async {
      // TODO
    });

    // Actualiza un testimonio
    //
    //Future<TestimonialDetail> updateTestimonial(String id, { UpdateTestimonialRequest updateTestimonialRequest }) async
    test('test updateTestimonial', () async {
      // TODO
    });

  });
}
