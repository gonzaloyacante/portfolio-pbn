/// Injects a Cloudinary transformation into a res.cloudinary.com URL.
///
/// [physicalWidth] is the target width in physical pixels (logical × DPR).
/// Returns [url] unchanged for non-Cloudinary URLs or already-transformed URLs.
String cloudinaryUrl(String url, int physicalWidth) {
  const marker = '/upload/';
  if (!url.contains('res.cloudinary.com')) return url;
  final idx = url.indexOf(marker);
  if (idx == -1) return url;
  final afterUpload = url.substring(idx + marker.length);
  // Already has a transform layer — first segment matches Cloudinary param syntax (e.g. c_fill, w_400).
  if (RegExp(r'^[a-z]{1,2}_').hasMatch(afterUpload.split('/').first)) {
    return url;
  }
  return '${url.substring(0, idx + marker.length)}c_fill,w_$physicalWidth,q_auto,f_auto/$afterUpload';
}
