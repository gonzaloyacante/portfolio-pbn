import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for ServicesApi
void main() {
  final instance = PortfolioPbnApi().getServicesApi();

  group(ServicesApi, () {
    // Crea un servicio
    //
    //Future<ServiceDetail> createService({ CreateServiceRequest createServiceRequest }) async
    test('test createService', () async {
      // TODO
    });

    // Elimina un servicio (soft delete)
    //
    //Future<DeleteServiceResponse> deleteService(String id) async
    test('test deleteService', () async {
      // TODO
    });

    // Obtiene un servicio por ID
    //
    //Future<ServiceDetail> getService(String id) async
    test('test getService', () async {
      // TODO
    });

    // Lista servicios (admin)
    //
    //Future<ServiceList> listServices({ num page, num limit, String search, String active, String featured }) async
    test('test listServices', () async {
      // TODO
    });

    // Actualiza un servicio
    //
    //Future<ServiceDetail> updateService(String id, { UpdateServiceRequest updateServiceRequest }) async
    test('test updateService', () async {
      // TODO
    });

  });
}
