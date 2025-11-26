export default async function AdminEntityManagement({ params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params
  return <div>Gestión de: {entity}</div>
}
