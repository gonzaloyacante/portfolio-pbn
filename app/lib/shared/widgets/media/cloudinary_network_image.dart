import 'package:flutter/material.dart';

import '../../../core/utils/cloudinary_helper.dart';
import 'app_network_image.dart';

/// Wrapper over [AppNetworkImage] that automatically requests the right
/// Cloudinary variant based on the actual rendered width × device pixel ratio.
///
/// Non-Cloudinary URLs are passed through unchanged.
class CloudinaryNetworkImage extends StatelessWidget {
  const CloudinaryNetworkImage({
    super.key,
    required this.imageUrl,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
    this.placeholder,
    this.errorWidget,
  });

  final String imageUrl;
  final BoxFit fit;
  final double? width;
  final double? height;
  final Widget? placeholder;
  final Widget? errorWidget;

  @override
  Widget build(BuildContext context) {
    final dpr = MediaQuery.devicePixelRatioOf(context);
    return LayoutBuilder(
      builder: (context, constraints) {
        final logicalWidth = constraints.maxWidth.isFinite
            ? constraints.maxWidth
            : (width?.isFinite == true ? width! : 800.0);
        final physicalWidth = (logicalWidth * dpr).ceil();
        return AppNetworkImage(
          imageUrl: cloudinaryUrl(imageUrl, physicalWidth),
          fit: fit,
          width: width,
          height: height,
          memCacheWidth: physicalWidth,
          placeholder: placeholder,
          errorWidget: errorWidget,
        );
      },
    );
  }
}
