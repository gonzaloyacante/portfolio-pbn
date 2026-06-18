import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for AppReleaseApi
void main() {
  final instance = PortfolioPbnApi().getAppReleaseApi();

  group(AppReleaseApi, () {
    // Crea una nueva release
    //
    //Future<AppRelease> createRelease({ CreateReleaseRequest createReleaseRequest }) async
    test('test createRelease', () async {
      // TODO
    });

    // Elimina la release actual
    //
    //Future<DeleteReleaseResponse> deleteRelease() async
    test('test deleteRelease', () async {
      // TODO
    });

    // Obtiene la última release de la app
    //
    //Future<AppRelease> getLatestRelease() async
    test('test getLatestRelease', () async {
      // TODO
    });

  });
}
