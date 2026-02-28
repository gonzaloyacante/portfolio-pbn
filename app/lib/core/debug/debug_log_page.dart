import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../utils/app_logger.dart';

// ── Debug Log Page ────────────────────────────────────────────────────────────

/// Visor de logs in-app (solo en debug/profile builds).
///
/// Muestra las últimas [AppLogger._maxLogs] entradas. Se actualiza
/// en tiempo real a medida que la app genera nuevos logs.
class DebugLogPage extends StatefulWidget {
  const DebugLogPage({super.key});

  @override
  State<DebugLogPage> createState() => _DebugLogPageState();
}

class _DebugLogPageState extends State<DebugLogPage> {
  LogLevel? _filterLevel; // null = mostrar todos
  final _scrollController = ScrollController();
  List<LogEntry> _logs = [];

  @override
  void initState() {
    super.initState();
    _logs = AppLogger.recentLogs.toList();
    AppLogger.addListener(_onLogsChanged);
  }

  @override
  void dispose() {
    AppLogger.removeListener(_onLogsChanged);
    _scrollController.dispose();
    super.dispose();
  }

  void _onLogsChanged() {
    if (!mounted) return;
    setState(() {
      _logs = AppLogger.recentLogs.toList();
    });
  }

  List<LogEntry> get _filteredLogs => _filterLevel == null
      ? _logs
      : _logs.where((e) => e.level == _filterLevel).toList();

  Color _levelColor(LogLevel level) => switch (level) {
    LogLevel.debug => Colors.grey,
    LogLevel.info => Colors.green,
    LogLevel.warn => Colors.orange,
    LogLevel.error => Colors.red,
  };

  @override
  Widget build(BuildContext context) {
    final logs = _filteredLogs;

    return Scaffold(
      appBar: AppBar(
        title: Text('Logs (${logs.length})'),
        actions: [
          // ── Filtro por nivel ────────────────────────────────────────
          PopupMenuButton<LogLevel?>(
            icon: const Icon(Icons.filter_list),
            tooltip: 'Filtrar por nivel',
            onSelected: (level) => setState(() => _filterLevel = level),
            itemBuilder: (_) => [
              const PopupMenuItem(value: null, child: Text('Todos')),
              PopupMenuItem(
                value: LogLevel.debug,
                child: Text(
                  '🐛 Debug',
                  style: TextStyle(color: _levelColor(LogLevel.debug)),
                ),
              ),
              PopupMenuItem(
                value: LogLevel.info,
                child: Text(
                  '✅ Info',
                  style: TextStyle(color: _levelColor(LogLevel.info)),
                ),
              ),
              PopupMenuItem(
                value: LogLevel.warn,
                child: Text(
                  '⚠️ Warn',
                  style: TextStyle(color: _levelColor(LogLevel.warn)),
                ),
              ),
              PopupMenuItem(
                value: LogLevel.error,
                child: Text(
                  '❌ Error',
                  style: TextStyle(color: _levelColor(LogLevel.error)),
                ),
              ),
            ],
          ),
          // ── Ir al final ─────────────────────────────────────────────
          IconButton(
            icon: const Icon(Icons.vertical_align_bottom),
            tooltip: 'Ir al último log',
            onPressed: () {
              if (_scrollController.hasClients) {
                _scrollController.animateTo(
                  _scrollController.position.maxScrollExtent,
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeOut,
                );
              }
            },
          ),
          // ── Limpiar ─────────────────────────────────────────────────
          IconButton(
            icon: const Icon(Icons.delete_outline),
            tooltip: 'Limpiar logs',
            onPressed: () {
              AppLogger.clearLogs();
              setState(() => _logs = []);
            },
          ),
        ],
      ),
      body: logs.isEmpty
          ? const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.check_circle_outline,
                    size: 48,
                    color: Colors.grey,
                  ),
                  SizedBox(height: 8),
                  Text('Sin logs', style: TextStyle(color: Colors.grey)),
                ],
              ),
            )
          : ListView.separated(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: logs.length,
              separatorBuilder: (context, index) =>
                  const Divider(height: 1, indent: 16),
              itemBuilder: (context, index) {
                final entry = logs[index];
                return _LogTile(
                  entry: entry,
                  levelColor: _levelColor(entry.level),
                );
              },
            ),
    );
  }
}

// ── Log Tile ──────────────────────────────────────────────────────────────────

class _LogTile extends StatelessWidget {
  const _LogTile({required this.entry, required this.levelColor});

  final LogEntry entry;
  final Color levelColor;

  @override
  Widget build(BuildContext context) {
    final time =
        '${entry.timestamp.hour.toString().padLeft(2, '0')}:'
        '${entry.timestamp.minute.toString().padLeft(2, '0')}:'
        '${entry.timestamp.second.toString().padLeft(2, '0')}';

    return InkWell(
      onLongPress: () {
        // Long press: copiar al portapapeles
        final text =
            '[${entry.levelLabel}] $time\n${entry.message}'
            '${entry.error != null ? '\nError: ${entry.error}' : ''}';
        Clipboard.setData(ClipboardData(text: text));
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Log copiado al portapapeles'),
            duration: Duration(seconds: 1),
          ),
        );
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Indicador de nivel (color + emoji)
            Container(
              width: 4,
              height: 40,
              decoration: BoxDecoration(
                color: levelColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        '${entry.emoji} ${entry.levelLabel}',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: levelColor,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        time,
                        style: const TextStyle(
                          fontSize: 11,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    entry.message,
                    style: const TextStyle(fontSize: 12),
                    maxLines: 4,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (entry.error != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      '${entry.error}',
                      style: const TextStyle(fontSize: 11, color: Colors.red),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
