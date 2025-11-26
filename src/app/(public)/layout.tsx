export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">Public Header</header>
      <main className="flex-1">{children}</main>
      <footer className="p-4 border-t">Public Footer</footer>
    </div>
  )
}
