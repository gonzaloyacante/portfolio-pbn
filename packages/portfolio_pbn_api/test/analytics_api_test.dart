import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for AnalyticsApi
void main() {
  final instance = PortfolioPbnApi().getAnalyticsApi();

  group(AnalyticsApi, () {
    // Resumen del dashboard (contadores operativos)
    //
    //Future<AnalyticsOverview> getAnalyticsOverview() async
    test('test getAnalyticsOverview', () async {
      // TODO
    });

  });
}
