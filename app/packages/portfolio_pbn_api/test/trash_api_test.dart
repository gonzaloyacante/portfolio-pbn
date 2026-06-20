import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for TrashApi
void main() {
  final instance = PortfolioPbnApi().getTrashApi();

  group(TrashApi, () {
    // Lista items en la papelera agrupados por tipo
    //
    //Future<TrashList> listTrash({ String type }) async
    test('test listTrash', () async {
      // TODO
    });

    // Elimina permanentemente un item de la papelera
    //
    //Future<PermanentDeleteTrashResponse> permanentDeleteTrashItem(String type, String id) async
    test('test permanentDeleteTrashItem', () async {
      // TODO
    });

    // Restaura un item de la papelera
    //
    //Future<RestoreTrashResponse> restoreTrashItem(String type, String id) async
    test('test restoreTrashItem', () async {
      // TODO
    });

  });
}
