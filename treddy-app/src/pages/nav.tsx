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
      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">

        <div className="justify-self-start">
          <Link href="/" className="relative group text-2xl font-extrabold text-[#00E6F6]">
            TREDDY
            <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#00E6F6] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        </div>


        <nav className="hidden md:flex space-x-8 justify-self-center" aria-label="Main Navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative group py-2"
            >
              <span
                className={`transition-colors ${pathname === href
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


        <div className="hidden md:flex space-x-6 items-center justify-self-end">

          {isAdmin ? (
            <Link
              href="/gestion-productos"
              className={`flex items-center space-x-2 transition-colors ${pathname === "/gestion-productos"
                ? "text-[#00E6F6] font-semibold"
                : "text-white hover:text-[#00E6F6]"
                }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/carrito-compras"
              className={`flex items-center space-x-2 transition-colors ${pathname === "/carrito-compras"
                ? "text-[#00E6F6] font-semibold"
                : "text-white hover:text-[#00E6F6]"
                }`}
            >
              <ShoppingBag size={20} />
              <span>Carrito</span>
            </Link>
          )}


          {isLoggedIn ? (
            <>
              <Link
                href="/perfil"
                className={`flex items-center space-x-2 transition-colors ${pathname === "/perfil"
                  ? "text-[#00E6F6] font-semibold"
                  : "text-white hover:text-[#00E6F6]"
                  }`}
              >
                <User size={20} />
                <span>Perfil</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-4 py-2 rounded-full font-semibold hover:opacity-90 shadow-md"
              >
                <LogOut size={18} />
                <span>Cerrar sesión</span>
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


        <div className="md:hidden justify-self-end">
          <button
            className="text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
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
                  className={`block ${pathname === href
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
                className={`flex items-center space-x-2 ${pathname === (isAdmin ? "/dashboard" : "/carrito-compras")
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
                    className={`flex items-center space-x-2 ${pathname === "/perfil"
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
