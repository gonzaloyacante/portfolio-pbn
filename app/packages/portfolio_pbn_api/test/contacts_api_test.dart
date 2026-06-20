import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for ContactsApi
void main() {
  final instance = PortfolioPbnApi().getContactsApi();

  group(ContactsApi, () {
    // Elimina un contacto (soft delete)
    //
    //Future<DeleteContactResponse> deleteContact(String id) async
    test('test deleteContact', () async {
      // TODO
    });

    // Obtiene un contacto por ID (marca como leído)
    //
    //Future<ContactDetail> getContact(String id) async
    test('test getContact', () async {
      // TODO
    });

    // Lista contactos (admin)
    //
    //Future<ContactList> listContacts({ num page, num limit, String search, String status, String isRead }) async
    test('test listContacts', () async {
      // TODO
    });

    // Actualiza un contacto
    //
    //Future<ContactDetail> updateContact(String id, { UpdateContactRequest updateContactRequest }) async
    test('test updateContact', () async {
      // TODO
    });

  });
}
