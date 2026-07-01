"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, LayoutDashboard, User, LogOut } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

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
    { href: "/contactanos", label: "Contacto" },
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
    <motion.header
      className="bg-[#0A0F2C] border-b border-[#1a1f40] shadow-md sticky top-0 z-50"
    >
      {/* Usamos position relative en el contenedor para poder centrar el nav absolutamente */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center relative">

        {/* Logo — lado izquierdo, ocupa flex-1 para empujar el centro */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="relative group text-xl sm:text-2xl font-extrabold text-[#00E6F6]">
            TREDDY
            <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#00E6F6] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        </div>

        {/* Desktop Nav Links — centrado ABSOLUTAMENTE para que no dependa de los laterales */}
        <nav
          className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2"
          aria-label="Main Navigation"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative group py-2 whitespace-nowrap"
            >
              <span
                className={`text-sm transition-colors ${pathname === href
                  ? "text-[#00E6F6] font-semibold"
                  : "text-white hover:text-[#00E6F6]"
                  }`}
              >
                {label}
              </span>
              {pathname === href && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#00E6F6] shadow-[0_0_10px_#00E6F6]"
                />
              )}
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#00E6F6] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </nav>

        {/* Desktop Right Actions — lado derecho, ocupa flex-1 para empujar el centro */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-3">

          {isAdmin ? (
            <Link
              href="/gestion-productos"
              className={`flex items-center gap-1.5 text-sm whitespace-nowrap transition-colors ${pathname === "/gestion-productos"
                ? "text-[#00E6F6] font-semibold"
                : "text-white hover:text-[#00E6F6]"
                }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/carrito-compras"
              className={`flex items-center gap-1.5 text-sm whitespace-nowrap transition-colors ${pathname === "/carrito-compras"
                ? "text-[#00E6F6] font-semibold"
                : "text-white hover:text-[#00E6F6]"
                }`}
            >
              <ShoppingBag size={18} />
              <span>Carrito</span>
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <Link
                href="/perfil"
                className={`flex items-center gap-1.5 text-sm whitespace-nowrap transition-colors ${pathname === "/perfil"
                  ? "text-[#00E6F6] font-semibold"
                  : "text-white hover:text-[#00E6F6]"
                  }`}
              >
                <User size={18} />
                <span>Perfil</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 shadow-md transition-opacity whitespace-nowrap"
              >
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-5 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 shadow-md transition-opacity whitespace-nowrap"
            >
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Mobile: Cart icon + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {!isAdmin && (
            <Link
              href="/carrito-compras"
              className="text-white hover:text-[#00E6F6] transition-colors"
              aria-label="Carrito"
            >
              <ShoppingBag size={24} />
            </Link>
          )}
          <button
            className="text-white p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>


      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0A0F2C] px-6 pb-6 space-y-4 overflow-hidden border-t border-[#1a1f40]"
          >
            {links.map(({ href, label }, index) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={href}
                  className={`block py-2 ${pathname === href
                    ? "text-[#00E6F6] font-semibold"
                    : "text-white hover:text-[#00E6F6]"
                    }`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </motion.div>
            ))}


            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href={isAdmin ? "/dashboard" : "/carrito-compras"}
                onClick={() => setOpen(false)}
                className={`flex items-center space-x-2 py-2 ${pathname === (isAdmin ? "/dashboard" : "/carrito-compras")
                  ? "text-[#00E6F6] font-semibold"
                  : "text-white hover:text-[#00E6F6]"
                  }`}
              >
                {isAdmin ? <LayoutDashboard size={20} /> : <ShoppingBag size={20} />}
                <span>{isAdmin ? "Dashboard" : "Carrito"}</span>
              </Link>
            </motion.div>

            <div className="border-t border-cyan-800 pt-4 space-y-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/perfil"
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-2 py-2 ${pathname === "/perfil"
                      ? "text-[#00E6F6] font-semibold"
                      : "text-white hover:text-[#00E6F6]"
                      }`}
                  >
                    <User size={20} />
                    <span>Perfil</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-2 rounded-full font-semibold hover:opacity-90 shadow-md"
                  >
                    <LogOut size={18} />
                    <span>Cerrar sesión</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
