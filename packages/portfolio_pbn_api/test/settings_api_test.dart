import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for SettingsApi
void main() {
  final instance = PortfolioPbnApi().getSettingsApi();

  group(SettingsApi, () {
    // Elimina una red social por id o platform
    //
    //Future<DeleteSocialLinkResponse> deleteSocialLink({ DeleteSocialLinkRequest deleteSocialLinkRequest }) async
    test('test deleteSocialLink', () async {
      // TODO
    });

    // Obtiene la configuración de un tipo (singleton)
    //
    //Future<Map<String, Object>> getSettings(String type) async
    test('test getSettings', () async {
      // TODO
    });

    // Lista redes sociales configuradas
    //
    //Future<List<SocialLink>> listSocialLinks() async
    test('test listSocialLinks', () async {
      // TODO
    });

    // Actualiza la configuración de un tipo
    //
    //Future<Map<String, Object>> updateSettings(String type, { Map<String, Object> requestBody }) async
    test('test updateSettings', () async {
      // TODO
    });

    // Crea o actualiza una red social (upsert por platform)
    //
    //Future<SocialLink> upsertSocialLink({ UpsertSocialLinkRequest upsertSocialLinkRequest }) async
    test('test upsertSocialLink', () async {
      // TODO
    });

  });
}
