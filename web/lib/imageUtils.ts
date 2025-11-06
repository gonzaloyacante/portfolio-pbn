export type CloudinaryKind = "thumb" | "card" | "viewer" | "avatar";

// Inserta transformaciones de Cloudinary si la URL pertenece a res.cloudinary.com
// Mantiene intactas URLs que no sean de Cloudinary.
export function normalizeCloudinary(url: string, kind: CloudinaryKind): string {
  if (!url || typeof url !== "string") return url;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("res.cloudinary.com")) return url;

    // Estructura típica: https://res.cloudinary.com/<cloud>/image/upload/<transformaciones opcionales>/<path>
    // Insertamos transformaciones después de "/image/upload/"
    const parts = u.pathname.split("/");
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return url;

    const base = parts.slice(0, uploadIdx + 1); // incluye 'upload'
    const rest = parts.slice(uploadIdx + 1); // resto del path (puede incluir ya transforms)

    // Si ya hay transformaciones (contienen comas/parametros), las preservamos delante del nuevo set
    const current = rest.length > 0 ? rest[0] : "";
    const hasExistingTransforms = current.includes(",") || current.includes("_") && current.match(/^[a-zA-Z0-9_,:-]+$/);

    const transforms = getTransforms(kind);
    const finalPath = [
      ...base,
      hasExistingTransforms ? `${current},${transforms}` : transforms,
      ...(hasExistingTransforms ? rest.slice(1) : rest),
    ].join("/");

    // Reconstruimos URL
    u.pathname = finalPath;
    return u.toString();
  } catch {
    return url;
  }
}

function getTransforms(kind: CloudinaryKind): string {
  switch (kind) {
    case "thumb":
      return "f_auto,q_auto,c_fill,g_auto,w_200,h_200";
    case "card":
      return "f_auto,q_auto,c_fill,g_auto,w_800,h_600";
    case "viewer":
      return "f_auto,q_auto,c_fill,g_auto,w_1400,h_900";
    case "avatar":
      return "f_auto,q_auto,c_fill,g_auto,w_300,h_300";
    default:
      return "f_auto,q_auto";
  }
}
