export default function Footer() {
  return (
    <footer className="border-primary/10 bg-bg text-primary/80 font-primary border-t py-12 text-center transition-colors duration-300">
      <div className="container mx-auto px-4">
        <p className="mb-4 text-sm font-light tracking-widest">
          © {new Date().getFullYear()} PAOLA BOLÍVAR NIEVAS
        </p>
        <p className="text-xs opacity-60"> All rights reserved.</p>
      </div>
    </footer>
  )
}
