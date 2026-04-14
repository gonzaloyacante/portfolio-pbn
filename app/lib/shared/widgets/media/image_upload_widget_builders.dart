part of 'image_upload_widget.dart';

extension _ImageUploadWidgetBuilders on _ImageUploadWidgetState {
  Widget _buildTabletLayout(ColorScheme colorScheme) {
    return SizedBox(
      height: widget.height,
      width: double.infinity,
      child: Container(
        padding: const EdgeInsets.all(8),
        child: AnimatedBuilder(
          animation: _buttonsAnim,
          builder: (context, _) {
            final p = _buttonsAnim.value;
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRect(
                  child: SizedBox(
                    width: 100.0 * p,
                    child: Opacity(
                      opacity: p,
                      child: Column(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _isProcessing
                                  ? null
                                  : _showSourcePicker,
                              style: ElevatedButton.styleFrom(
                                minimumSize: Size.zero,
                                padding: EdgeInsets.zero,
                                shape: RoundedRectangleBorder(
                                  borderRadius: const BorderRadius.circular(8),
                                ),
                              ),
                              child: const SizedBox.expand(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.edit_outlined, size: 20),
                                    const SizedBox(height: 6),
                                    Text(
                                      'Editar',
                                      style: const TextStyle(fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: _isProcessing ? null : _handleRemove,
                              style: OutlinedButton.styleFrom(
                                minimumSize: Size.zero,
                                padding: EdgeInsets.zero,
                                shape: RoundedRectangleBorder(
                                  borderRadius: const BorderRadius.circular(8),
                                ),
                                side: BorderSide(color: colorScheme.outline),
                                foregroundColor: colorScheme.onSurface,
                              ),
                              child: const SizedBox.expand(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.close, size: 20),
                                    const SizedBox(height: 6),
                                    Text(
                                      'Quitar',
                                      style: const TextStyle(fontSize: 12),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 12.0 * p),
                Expanded(
                  child: GestureDetector(
                    onTap: !_hasImage && !_isProcessing
                        ? _showSourcePicker
                        : null,
                    child: Container(
                      height: double.infinity,
                      clipBehavior: Clip.antiAlias,
                      decoration: BoxDecoration(
                        borderRadius: const BorderRadius.circular(12),
                        border: Border.all(
                          color: colorScheme.outline.withValues(alpha: 0.3),
                        ),
                        color: colorScheme.surfaceContainerHighest,
                      ),
                      child: _isProcessing
                          ? const Center(child: CircularProgressIndicator())
                          : _hasImage
                          ? _ImagePreview(
                              file: _selectedFile,
                              url: widget.currentImageUrl,
                              onRemove: null,
                              onEdit: null,
                            )
                          : _EmptyPreview(
                              hint: 'Toca para añadir una imagen',
                              colorScheme: colorScheme,
                            ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildMobileLayout(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        GestureDetector(
          onTap: !_hasImage && !_isProcessing ? _showSourcePicker : null,
          child: Container(
            height: widget.height,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.circular(12),
              border: Border.all(
                color: colorScheme.outline.withValues(alpha: 0.3),
              ),
              color: colorScheme.surfaceContainerHighest,
            ),
            child: _isProcessing
                ? const Center(child: CircularProgressIndicator())
                : _hasImage
                ? _ImagePreview(
                    file: _selectedFile,
                    url: widget.currentImageUrl,
                    onRemove: null,
                    onEdit: null,
                  )
                : _EmptyPreview(
                    hint: 'Toca para añadir una imagen',
                    colorScheme: colorScheme,
                  ),
          ),
        ),
        AnimatedSize(
          duration: const Duration(milliseconds: 350),
          curve: Curves.easeInOut,
          child: _hasImage
              ? Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: 52,
                          child: ElevatedButton(
                            onPressed: _isProcessing ? null : _showSourcePicker,
                            style: ElevatedButton.styleFrom(
                              minimumSize: Size.zero,
                              padding: EdgeInsets.zero,
                              shape: RoundedRectangleBorder(
                                borderRadius: const BorderRadius.circular(8),
                              ),
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.edit_outlined, size: 18),
                                const SizedBox(width: 6),
                                Text('Editar', style: const TextStyle(fontSize: 13)),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: SizedBox(
                          height: 52,
                          child: OutlinedButton(
                            onPressed: _isProcessing ? null : _handleRemove,
                            style: OutlinedButton.styleFrom(
                              minimumSize: Size.zero,
                              padding: EdgeInsets.zero,
                              shape: RoundedRectangleBorder(
                                borderRadius: const BorderRadius.circular(8),
                              ),
                              side: BorderSide(color: colorScheme.outline),
                              foregroundColor: colorScheme.onSurface,
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.close, size: 18),
                                const SizedBox(width: 6),
                                Text('Quitar', style: const TextStyle(fontSize: 13)),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : const SizedBox.shrink(),
        ),
      ],
    );
  }
}
