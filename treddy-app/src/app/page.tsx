"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getFiguras } from "@/services/figuras.service";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Navbar";
import { Figura } from "@/types";

// Static imports for above-the-fold content
import Hero from "@/components/sections/landing/Hero";
import PopularProducts from "@/components/sections/landing/PopularProducts";

// Dynamic imports for below-the-fold content to optimize initial bundle
const HowItWorks = dynamic(() => import("@/components/sections/landing/HowItWorks"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
});

const WhyChooseUs = dynamic(() => import("@/components/sections/landing/WhyChooseUs"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
});

const Testimonials = dynamic(
  () => import("@/components/sections/landing/Testimonials"),
  {
    loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
  },
);

const ARSection = dynamic(() => import("@/components/sections/landing/ARSection"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
});

const Newsletter = dynamic(() => import("@/components/sections/landing/Newsletter"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
});

export default function HomePage() {
  const [figuras, setFiguras] = useState<Figura[]>([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  const handleVerMas = (nombre: string) => {
    window.location.href = `/catalogo?search=${encodeURIComponent(nombre)}`;
  };

  return (
    <main className="min-h-screen bg-[#0A0F2C] text-white relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>
      <Nav />

      <Hero figuras={figuras} />

      <PopularProducts figuras={figuras} handleVerMas={handleVerMas} />

      <HowItWorks />

      <WhyChooseUs />

      <Testimonials
        testimonialIndex={testimonialIndex}
        setTestimonialIndex={setTestimonialIndex}
      />

      <ARSection />

      <Newsletter />

      <Footer />
    </main>
  );
}
