"use client";

import { useState } from "react";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactanosPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });

      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>
      <Nav />

      <section className="mx-8 mt-10 px-8 py-16 bg-[#0F173A]/20 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight">
          Contáctanos
        </h1>
        <p className="mt-5 text-lg text-[#B5B8C5] max-w-2xl">
          ¿Tienes preguntas o necesitas ayuda? Estamos aquí para ti. Envíanos un
          mensaje y te responderemos lo antes posible.
        </p>
      </section>

      <div className="mx-8 my-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-[#10193F] p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Envíanos un mensaje
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-[#B5B8C5] mb-2"
              >
                Nombre completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full bg-[#0A0F2C] border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#B5B8C5] mb-2"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#0A0F2C] border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="asunto"
                className="block text-sm font-medium text-[#B5B8C5] mb-2"
              >
                Asunto
              </label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
                className="w-full bg-[#0A0F2C] border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            <div>
              <label
                htmlFor="mensaje"
                className="block text-sm font-medium text-[#B5B8C5] mb-2"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-[#0A0F2C] border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-3 rounded-full font-semibold hover:opacity-90 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar mensaje
                </>
              )}
            </button>

            {submitStatus === "success" && (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-green-300">
                ¡Mensaje enviado exitosamente! Te responderemos pronto.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-300">
                Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.
              </div>
            )}
          </form>
        </section>

        <section className="space-y-6">
          <div className="bg-[#10193F] p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Información de contacto
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-full">
                  <Mail className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Correo electrónico
                  </h3>
                  <a
                    href="mailto:contacto@treddy.com"
                    className="text-[#B5B8C5] hover:text-cyan-400 transition-colors"
                  >
                    contacto@treddy.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-full">
                  <Phone className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                  <a
                    href="tel:+573001234567"
                    className="text-[#B5B8C5] hover:text-cyan-400 transition-colors"
                  >
                    +57 300 123 4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-full">
                  <MapPin className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Ubicación</h3>
                  <p className="text-[#B5B8C5]">
                    Bogotá, Colombia
                    <br />
                    Calle 123 #45-67
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#10193F] p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Horario de atención
            </h3>
            <div className="space-y-2 text-[#B5B8C5]">
              <p>
                <span className="font-semibold text-white">
                  Lunes - Viernes:
                </span>{" "}
                8:00 AM - 6:00 PM
              </p>
              <p>
                <span className="font-semibold text-white">Sábados:</span> 9:00
                AM - 2:00 PM
              </p>
              <p>
                <span className="font-semibold text-white">Domingos:</span>{" "}
                Cerrado
              </p>
            </div>
          </div>

          <div className="bg-[#10193F] p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Síguenos
            </h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0A0F2C] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 p-3 rounded-full transition-all group"
              >
                <svg
                  className="w-6 h-6 group-hover:text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0A0F2C] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 p-3 rounded-full transition-all group"
              >
                <svg
                  className="w-6 h-6 group-hover:text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0A0F2C] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 p-3 rounded-full transition-all group"
              >
                <svg
                  className="w-6 h-6 group-hover:text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
