"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/personalizacion", label: "Personalizar" },
    { href: "/contacto", label: "Contacto" },
  ];

  const userLinks = [
    { href: "/carrito-compras", label: "Carrito" },
    { href: "/perfil", label: "Perfil" },
  ];

  return (
    <header className="bg-[#0A0F2C] border-b border-[#1a1f40] shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-[#00E6F6]">
          TREDDY
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-8" aria-label="Main Navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                pathname === href
                  ? "text-[#00E6F6] font-semibold"
                  : "text-white hover:text-[#00E6F6]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop user links */}
        <div className="hidden md:flex space-x-6">
          {userLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                pathname === href
                  ? "text-[#00E6F6] font-semibold"
                  : "text-white hover:text-[#00E6F6]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0A0F2C] px-6 pb-6 space-y-4">
          {[...links, ...userLinks].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block ${
                pathname === href
                  ? "text-[#00E6F6] font-semibold"
                  : "text-white hover:text-[#00E6F6]"
              }`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
