import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for UploadApi
void main() {
  final instance = PortfolioPbnApi().getUploadApi();

  group(UploadApi, () {
    // Elimina un asset de Cloudinary por publicId
    //
    //Future<DeleteUploadResponse> deleteUploadedAsset({ DeleteUploadRequest deleteUploadRequest }) async
    test('test deleteUploadedAsset', () async {
      // TODO
    });

    // Genera una firma Cloudinary para subida directa
    //
    //Future<UploadSignResponse> getUploadSignature({ UploadSignRequest uploadSignRequest }) async
    test('test getUploadSignature', () async {
      // TODO
    });

  });
}
