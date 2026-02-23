import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/account_repository.dart';

part 'account_provider.g.dart';

@riverpod
AccountRepository accountRepository(Ref ref) {
  return AccountRepository(ref.watch(apiClientProvider));
}
