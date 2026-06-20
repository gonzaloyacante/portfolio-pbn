import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for PushApi
void main() {
  final instance = PortfolioPbnApi().getPushApi();

  group(PushApi, () {
    // Registra token FCM para push notifications
    //
    //Future<PushRegisterResponse> registerPushToken({ PushRegisterRequest pushRegisterRequest }) async
    test('test registerPushToken', () async {
      // TODO
    });

    // Elimina token FCM
    //
    //Future<PushUnregisterResponse> unregisterPushToken({ PushUnregisterRequest pushUnregisterRequest }) async
    test('test unregisterPushToken', () async {
      // TODO
    });

  });
}
