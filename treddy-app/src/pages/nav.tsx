"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id: number;
  email: string;
  role: string;
  exp: number;
};

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
    { href: "/personalizacion", label: "Personalizar" },
    { href: "/contacto", label: "Contacto" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode<TokenPayload>(token);
          setIsLoggedIn(true);
          setIsAdmin(decoded.role === "administrador");
        } catch (error) {
          console.error("Error al decodificar token:", error);
          localStorage.removeItem("token");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
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
          {/* 🔹 Muestra Dashboard si es admin, sino Carrito */}
          {isAdmin ? (
            <Link
              href="/gestion-productos"
              className={`transition-colors ${
                pathname === "/gestion-productos"
                  ? "text-[#00E6F6] font-semibold"
                  : "text-white hover:text-[#00E6F6]"
              }`}
            >
              Dashboard
            </Link>
          ) : (
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
          )}

          {/* 🔹 Si está logueado */}
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

          {/* 🔹 Carrito o Dashboard en móvil */}
          <Link
            href={isAdmin ? "/dashboard" : "/carrito-compras"}
            onClick={() => setOpen(false)}
            className={`block ${
              pathname === (isAdmin ? "/dashboard" : "/carrito-compras")
                ? "text-[#00E6F6] font-semibold"
                : "text-white hover:text-[#00E6F6]"
            }`}
          >
            {isAdmin ? "Dashboard" : "Carrito"}
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
