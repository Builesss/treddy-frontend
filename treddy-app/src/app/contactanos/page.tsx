"use client";

import { useState } from "react";
import Nav from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FormData = {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const faqs = [
  {
    q: "¿Cuánto tiempo tarda en llegar mi pedido?",
    a: "Los pedidos estándar se entregan entre 3 a 5 días hábiles. Para personalizaciones especiales puede tomar hasta 7 días.",
  },
  {
    q: "¿Puedo personalizar las tallas y colores?",
    a: "¡Absolutamente! Contamos con una amplia gama de tallas (XS–4XL) y podemos adaptar cualquier color de nuestra paleta disponible.",
  },
  {
    q: "¿Tienen política de devoluciones?",
    a: "Sí, aceptamos devoluciones dentro de los primeros 15 días siempre que el producto esté en su estado original y sin usar.",
  },
  {
    q: "¿Hacen pedidos al por mayor o corporativos?",
    a: "Sí, ofrecemos precios especiales para pedidos corporativos de más de 10 unidades. Contáctanos para más información.",
  },
];

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    color: "#1877F2",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    color: "#E1306C",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com",
    color: "#1DA1F2",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/573001234567",
    color: "#25D366",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!data.nombre.trim()) errors.nombre = "El nombre es requerido";
  if (!data.email.trim()) {
    errors.email = "El correo es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Correo inválido";
  }
  if (!data.asunto.trim()) errors.asunto = "El asunto es requerido";
  if (!data.mensaje.trim()) {
    errors.mensaje = "El mensaje es requerido";
  } else if (data.mensaje.trim().length < 20) {
    errors.mensaje = "El mensaje debe tener al menos 20 caracteres";
  }
  return errors;
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="border border-white/10 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-white text-sm">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-cyan-400 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-[#B5B8C5] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
}: {
  id: keyof FormData;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
          active
            ? "top-2 text-[10px] font-semibold text-cyan-400"
            : "top-1/2 -translate-y-1/2 text-sm text-gray-500"
        }`}
      >
        {label}
        {required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? placeholder : ""}
        className={`w-full bg-[#0A0F2C] border rounded-xl px-4 pt-6 pb-2 text-white text-sm focus:outline-none transition-all duration-200 ${
          error
            ? "border-red-500/60 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
            : focused
            ? "border-cyan-400 shadow-[0_0_0_3px_rgba(0,230,246,0.12)]"
            : "border-white/10 hover:border-white/20"
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function FloatingTextarea({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  maxLength = 500,
}: {
  id: keyof FormData;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 ${
          active
            ? "top-2 text-[10px] font-semibold text-cyan-400"
            : "top-4 text-sm text-gray-500"
        }`}
      >
        {label}
        {required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={active ? placeholder : ""}
        maxLength={maxLength}
        rows={5}
        className={`w-full bg-[#0A0F2C] border rounded-xl px-4 pt-7 pb-3 text-white text-sm focus:outline-none transition-all duration-200 resize-none ${
          error
            ? "border-red-500/60 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
            : focused
            ? "border-cyan-400 shadow-[0_0_0_3px_rgba(0,230,246,0.12)]"
            : "border-white/10 hover:border-white/20"
        }`}
      />
      <div className="flex justify-between items-start mt-1">
        {error ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle size={12} /> {error}
          </p>
        ) : (
          <span />
        )}
        <span className={`text-xs ml-auto ${value.length >= maxLength * 0.9 ? "text-orange-400" : "text-gray-600"}`}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.015 }}
      className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/8 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,230,246,0.08)] transition-all duration-300 group"
    >
      <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">{title}</p>
        {children}
      </div>
    </motion.div>
  );
}

export default function ContactanosPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name as keyof FormData]) {
      setErrors(validate(updated));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(formData).map((k) => [k, true])
    ) as Record<keyof FormData, boolean>;
    setTouched(allTouched);

    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
      setTouched({});
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white">
      {/* Background glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-600/8 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <Nav />

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-16 text-center px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight pb-2">
            ¿En qué podemos
            <br />
            ayudarte?
          </h1>
          <p className="mt-5 text-lg text-[#8B8FA8] max-w-xl mx-auto leading-relaxed">
            Estamos disponibles para responder tus preguntas, recibir sugerencias
            o ayudarte con tu pedido.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-8"
        >
          {[
            { label: "Tiempo de respuesta", value: "< 2 horas" },
            { label: "Satisfacción de clientes", value: "98%" },
            { label: "Pedidos completados", value: "10k+" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-cyan-400">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Main Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-20 grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-3 bg-[#0F173A]/70 backdrop-blur-md border border-white/8 rounded-2xl p-7 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-1">Envíanos un mensaje</h2>
          <p className="text-sm text-gray-500 mb-7">
            Responderemos en menos de 2 horas en días hábiles.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FloatingInput
                id="nombre"
                label="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
                placeholder="Tu nombre"
                required
              />
              <FloatingInput
                id="email"
                label="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="tu@email.com"
                required
              />
            </div>

            <FloatingInput
              id="asunto"
              label="Asunto"
              value={formData.asunto}
              onChange={handleChange}
              error={errors.asunto}
              placeholder="¿En qué podemos ayudarte?"
              required
            />

            <FloatingTextarea
              id="mensaje"
              label="Mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              error={errors.mensaje}
              placeholder="Escribe tu mensaje aquí..."
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Enviar mensaje
                </>
              )}
            </button>

            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="flex items-center gap-3 bg-green-500/10 border border-green-500/40 rounded-xl p-4 text-green-300 text-sm"
                >
                  <CheckCircle2 size={20} className="shrink-0 text-green-400" />
                  <div>
                    <p className="font-semibold">¡Mensaje enviado!</p>
                    <p className="text-green-400/70 text-xs mt-0.5">Te responderemos en menos de 2 horas.</p>
                  </div>
                </motion.div>
              )}
              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="flex items-center gap-3 bg-red-500/10 border border-red-500/40 rounded-xl p-4 text-red-300 text-sm"
                >
                  <AlertCircle size={20} className="shrink-0 text-red-400" />
                  <div>
                    <p className="font-semibold">Error al enviar</p>
                    <p className="text-red-400/70 text-xs mt-0.5">Por favor intenta de nuevo.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          {/* Contact info */}
          <div className="bg-[#0F173A]/70 backdrop-blur-md border border-white/8 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-lg font-bold text-white mb-4">Información de contacto</h3>
            <InfoCard icon={<Mail size={20} className="text-cyan-400" />} title="Correo electrónico" delay={0.05}>
              <a href="mailto:contacto@treddy.com" className="text-sm text-white hover:text-cyan-400 transition-colors font-medium">
                contacto@treddy.com
              </a>
            </InfoCard>
            <InfoCard icon={<Phone size={20} className="text-cyan-400" />} title="Teléfono / WhatsApp" delay={0.1}>
              <a href="tel:+573001234567" className="text-sm text-white hover:text-cyan-400 transition-colors font-medium">
                +57 300 123 4567
              </a>
            </InfoCard>
            <InfoCard icon={<MapPin size={20} className="text-cyan-400" />} title="Ubicación" delay={0.15}>
              <p className="text-sm text-gray-300">
                Bogotá, Colombia<br />
                <span className="text-gray-500">Calle 123 #45-67</span>
              </p>
            </InfoCard>
            <InfoCard icon={<Clock size={20} className="text-cyan-400" />} title="Horario de atención" delay={0.2}>
              <div className="text-sm space-y-0.5">
                <p><span className="text-white">Lun – Vie:</span> <span className="text-gray-400">8:00 AM – 6:00 PM</span></p>
                <p><span className="text-white">Sábados:</span> <span className="text-gray-400">9:00 AM – 2:00 PM</span></p>
                <p><span className="text-white">Domingos:</span> <span className="text-red-400/80">Cerrado</span></p>
              </div>
            </InfoCard>
          </div>

          {/* Social links */}
          <div className="bg-[#0F173A]/70 backdrop-blur-md border border-white/8 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Síguenos en redes</h3>
            <div className="grid grid-cols-2 gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium"
                >
                  {s.icon}
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Map embed */}
          <div className="rounded-2xl overflow-hidden border border-white/8 shadow-xl h-44">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254508.37140638657!2d-74.24789285625!3d4.648590498590088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Treddy - Bogotá, Colombia"
            />
          </div>
        </motion.div>
      </div>

      {/* FAQ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white">Preguntas frecuentes</h2>
          <p className="text-sm text-gray-500 mt-2">
            Respuestas rápidas a las dudas más comunes de nuestros clientes.
          </p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
