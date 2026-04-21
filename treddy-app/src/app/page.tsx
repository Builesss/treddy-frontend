/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getFiguras } from "../lib/api";
import Footer from "@/pages/footer";
import Nav from "@/pages/nav";
import { Figura } from "@/lib/types";

// Static imports for above-the-fold content
import Hero from "@/components/landing/Hero";
import PopularProducts from "@/components/landing/PopularProducts";

// Dynamic imports for below-the-fold content to optimize initial bundle
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
});

const Categories = dynamic(() => import("@/components/landing/Categories"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
});

const WhyChooseUs = dynamic(() => import("@/components/landing/WhyChooseUs"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
});

const Testimonials = dynamic(
  () => import("@/components/landing/Testimonials"),
  {
    loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
  },
);

const ARSection = dynamic(() => import("@/components/landing/ARSection"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
});

const Newsletter = dynamic(() => import("@/components/landing/Newsletter"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800/20" />,
});

export default function HomePage() {
  const [figuras, setFiguras] = useState<Figura[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    getFiguras().then(setFiguras).catch(console.error);
  }, []);

  useEffect(() => {
    if (figuras.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, figuras.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? figuras.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === figuras.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

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

      <Hero
        figuras={figuras}
        currentIndex={currentIndex}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        goToSlide={goToSlide}
      />

      <PopularProducts figuras={figuras} handleVerMas={handleVerMas} />

      <HowItWorks />

      <Categories />

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
