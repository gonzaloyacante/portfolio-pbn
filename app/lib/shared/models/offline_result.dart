/// Resultado sellado de una operación de mutación que puede ser:
/// - [LiveResult]: la operación se completó en tiempo real contra el servidor.
/// - [OfflineEnqueuedResult]: no había conexión; la operación fue encolada
///   en SQLite y se ejecutará cuando el dispositivo se reconecte.
///
/// Los callers deben manejar ambos casos de forma explícita.
sealed class MutationResult<T> {
  const MutationResult();
}

/// La operación se completó correctamente y el servidor devolvió [data].
final class LiveResult<T> extends MutationResult<T> {
  const LiveResult(this.data);

  final T data;

  @override
  String toString() => 'LiveResult($data)';
}

/// Sin conexión — la operación fue encolada para sincronizarse más tarde.
/// No hay datos de servidor disponibles todavía.
final class OfflineEnqueuedResult<T> extends MutationResult<T> {
  const OfflineEnqueuedResult();

  @override
  String toString() => 'OfflineEnqueuedResult<$T>';
}
