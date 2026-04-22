import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#0F173A] text-white border-t border-white/5 mt-20 w-full overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Treddy
            </span>
          </div>
          <p className="text-[#B5B8C5] text-sm leading-relaxed">
            Revolucionando la experiencia de compra con tecnología de realidad
            aumentada y personalización 3D.
          </p>
          <div className="flex space-x-4 pt-2">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="p-2 rounded-full bg-[#10193F] text-gray-400 hover:text-cyan-400 hover:bg-[#1a2555] transition-all duration-300 group"
            >
              <Facebook
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="p-2 rounded-full bg-[#10193F] text-gray-400 hover:text-cyan-400 hover:bg-[#1a2555] transition-all duration-300 group"
            >
              <Instagram
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="p-2 rounded-full bg-[#10193F] text-gray-400 hover:text-cyan-400 hover:bg-[#1a2555] transition-all duration-300 group"
            >
              <Twitter
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
            Explorar
          </h2>
          <ul className="space-y-3 text-sm text-[#B5B8C5]">
            <li>
              <Link
                href="/catalogo"
                className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-300"
              >
                <span className="w-1 h-1 rounded-full bg-cyan-500/50"></span>{" "}
                Catálogo
              </Link>
            </li>
            <li>
              <Link
                href="/promociones"
                className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-300"
              >
                <span className="w-1 h-1 rounded-full bg-cyan-500/50"></span>{" "}
                Promociones
              </Link>
            </li>
            <li>
              <Link
                href="/loMasVendido"
                className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-300"
              >
                <span className="w-1 h-1 rounded-full bg-cyan-500/50"></span> Lo
                más vendido
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Información
          </h2>
          <ul className="space-y-3 text-sm text-[#B5B8C5]">
            <li>
              <Link
                href="/quienesSomos"
                className="hover:text-cyan-400 transition-colors"
              >
                Quiénes somos
              </Link>
            </li>
            <li>
              <Link
                href="/terminosCondiciones"
                className="hover:text-cyan-400 transition-colors"
              >
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link
                href="/politicasPrivacidad"
                className="hover:text-cyan-400 transition-colors"
              >
                Políticas de privacidad
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-cyan-400 transition-colors"
              >
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            Contacto
          </h2>
          <ul className="space-y-4 text-sm text-[#B5B8C5]">
            <li className="flex items-start gap-3 group">
              <div className="mt-1 p-1.5 rounded-lg bg-[#10193F] text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                <Mail size={16} />
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-0.5">
                  Correo electrónico
                </span>
                <Link
                  href="/contacto#email"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  info@treddy.com
                </Link>
              </div>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="mt-1 p-1.5 rounded-lg bg-[#10193F] text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                <Phone size={16} />
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-0.5">
                  Línea de atención
                </span>
                <Link
                  href="/contacto#telefono"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +57 300 123 4567
                </Link>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <div className="relative border-t border-white/5 bg-[#0F173A] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Treddy. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">
              Privacidad
            </span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">
              Cookies
            </span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">
              Legal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
