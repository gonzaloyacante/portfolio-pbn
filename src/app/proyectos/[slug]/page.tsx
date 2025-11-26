export default async function ProjectGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div>Galería del Proyecto: {slug}</div>
}
