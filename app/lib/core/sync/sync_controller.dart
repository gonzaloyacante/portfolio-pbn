import 'dart:async';

import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../network/connectivity_provider.dart';
import '../utils/app_logger.dart';
import 'outbox_service.dart';

part 'sync_controller.g.dart';

/// Orchestrates background sync: flushes the outbox whenever the device
/// transitions from offline → online.
class SyncController {
  SyncController({required OutboxService outbox}) : _outbox = outbox;

  final OutboxService _outbox;

  Future<void> syncNow() async {
    AppLogger.info('[SyncController] syncNow triggered');
    await _outbox.flush();
  }
}

@Riverpod(keepAlive: true)
SyncController syncController(Ref ref) {
  final ctrl = SyncController(outbox: ref.watch(outboxServiceProvider));

  // Flush on startup if already online — pending items from a previous
  // session would otherwise wait for an offline→online transition.
  if (ref.read(isOnlineProvider)) {
    AppLogger.info('[SyncController] online at startup — flushing outbox');
    unawaited(ctrl.syncNow());
  }

  // Flush outbox whenever the device comes back online.
  ref.listen<bool>(isOnlineProvider, (prev, next) {
    if (prev == false && next == true) {
      AppLogger.info('[SyncController] back online — flushing outbox');
      unawaited(ctrl.syncNow());
    }
  });

  return ctrl;
}
