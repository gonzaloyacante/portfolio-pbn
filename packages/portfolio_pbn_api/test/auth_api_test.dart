import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for AuthApi
void main() {
  final instance = PortfolioPbnApi().getAuthApi();

  group(AuthApi, () {
    // Obtiene perfil del admin autenticado
    //
    //Future<AdminProfile> adminGetMe() async
    test('test adminGetMe', () async {
      // TODO
    });

    // Admin login
    //
    //Future<LoginResponse> adminLogin({ LoginRequest loginRequest }) async
    test('test adminLogin', () async {
      // TODO
    });

    // Admin logout — clears httpOnly cookie
    //
    //Future<LogoutResponse> adminLogout() async
    test('test adminLogout', () async {
      // TODO
    });

    // Refresca access token via httpOnly refresh cookie
    //
    //Future<RefreshResponse> adminRefreshToken() async
    test('test adminRefreshToken', () async {
      // TODO
    });

    // Actualiza nombre o contraseña del admin
    //
    //Future<UpdateMeResponse> adminUpdateMe({ UpdateMeRequest updateMeRequest }) async
    test('test adminUpdateMe', () async {
      // TODO
    });

  });
}
