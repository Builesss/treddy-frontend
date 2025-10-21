"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/personalizacion", label: "Personalizar" },
    { href: "/contacto", label: "Contacto" },
  ];

  // 🔹 Verifica el token al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

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

        {/* Desktop user area */}
        <div className="hidden md:flex space-x-6 items-center">
          {/* 🔹 Carrito visible siempre */}
          <Link
            href="/carrito-compras"
            className={`transition-colors ${
              pathname === "/carrito-compras"
                ? "text-[#00E6F6] font-semibold"
                : "text-white hover:text-[#00E6F6]"
            }`}
          >
            Carrito
          </Link>

          {/* 🔹 Si está logueado, mostrar Perfil y Cerrar sesión */}
          {isLoggedIn ? (
            <>
              <Link
                href="/perfil"
                className={`transition-colors ${
                  pathname === "/perfil"
                    ? "text-[#00E6F6] font-semibold"
                    : "text-white hover:text-[#00E6F6]"
                }`}
              >
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-4 py-2 rounded-full font-semibold hover:opacity-90 shadow-md"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-2 rounded-full font-semibold hover:opacity-90 shadow-md"
            >
              Iniciar sesión
            </Link>
          )}
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
          {links.map(({ href, label }) => (
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

          {/* 🔹 Carrito siempre disponible en móvil */}
          <Link
            href="/carrito-compras"
            onClick={() => setOpen(false)}
            className={`block ${
              pathname === "/carrito-compras"
                ? "text-[#00E6F6] font-semibold"
                : "text-white hover:text-[#00E6F6]"
            }`}
          >
            Carrito
          </Link>

          <div className="border-t border-cyan-800 pt-4 space-y-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/perfil"
                  onClick={() => setOpen(false)}
                  className={`block ${
                    pathname === "/perfil"
                      ? "text-[#00E6F6] font-semibold"
                      : "text-white hover:text-[#00E6F6]"
                  }`}
                >
                  Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-2 rounded-full font-semibold hover:opacity-90 shadow-md"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="block bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-2 rounded-full font-semibold text-center hover:opacity-90 shadow-md"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
