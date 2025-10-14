import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F173A] text-white border-t border-[#1a1f40] mt-15 w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Sobre nosotros */}
        <section>
          <h2 className="font-bold text-lg mb-3 text-[#00E6F6]">Sobre nosotros</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/quienesSomos" className="hover:text-[#00E6F6] transition-colors">Quiénes somos</Link></li>
            <li><Link href="/terminosCondiciones" className="hover:text-[#00E6F6] transition-colors">Términos y condiciones</Link></li>
            <li><Link href="/politicasPrivacidad" className="hover:text-[#00E6F6] transition-colors">Políticas de privacidad</Link></li>
          </ul>
        </section>

        {/* Navegación */}
        <section>
          <h2 className="font-bold text-lg mb-3 text-[#00E6F6]">Navegación</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/catalogo" className="hover:text-[#00E6F6]">Catálogo</Link></li>
            <li><Link href="/promociones" className="hover:text-[#00E6F6]">Promociones</Link></li>
            <li><Link href="/loMasVendido" className="hover:text-[#00E6F6]">Lo más vendido</Link></li>
          </ul>
        </section>

        {/* Preguntas frecuentes */}
        <section>
          <h2 className="font-bold text-lg mb-3 text-[#00E6F6]">Preguntas frecuentes</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/faq#queEsAr" className="hover:text-[#00E6F6]">¿Qué es el AR?</Link></li>
            <li><Link href="/faq#comoFuncionaAr" className="hover:text-[#00E6F6]">¿Cómo funciona el AR?</Link></li>
            <li><Link href="/faq#preview3d" className="hover:text-[#00E6F6]">¿Qué es la previsualización 3D?</Link></li>
          </ul>
        </section>

        {/* Contacto */}
        <section>
          <h2 className="font-bold text-lg mb-3 text-[#00E6F6]">Contáctanos</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Correo: <Link href="/contacto#email" className="hover:text-[#00E6F6]">info@treddy.com</Link></li>
            <li>Teléfono: <Link href="/contacto#telefono" className="hover:text-[#00E6F6]">+57 300 123 4567</Link></li>
            <li>WhatsApp: <Link href="/contacto#whatsapp" className="hover:text-[#00E6F6]">+57 300 765 4321</Link></li>
          </ul>

          {/* Redes sociales */}
          <div className="flex space-x-4 mt-4">
            <Link href="https://facebook.com" target="_blank" className="hover:text-[#00E6F6]"><Facebook size={20} /></Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-[#00E6F6]"><Instagram size={20} /></Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-[#00E6F6]"><Twitter size={20} /></Link>
          </div>
        </section>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-[#1a1f40] text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-[#00E6F6] font-semibold">Treddy</span>. Todos los derechos reservados.
      </div>
    </footer>
  );
}
