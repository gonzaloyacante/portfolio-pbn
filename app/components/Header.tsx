import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <ul className="flex justify-center space-x-6">
          <li>
            <Link href="/" className="text-gray-800 hover:text-gray-600">
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/about-me"
              className="text-gray-800 hover:text-gray-600">
              Sobre Mí
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-800 hover:text-gray-600">
              Contacto
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
