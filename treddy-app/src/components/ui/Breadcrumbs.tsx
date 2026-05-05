"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide px-4 md:px-0">
      <Link
        href="/"
        className="flex items-center hover:text-[#00E6F6] transition-colors duration-200"
      >
        <Home size={16} className="mr-1" />
        <span className="hidden md:inline">Inicio</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight size={14} className="text-gray-600" />
          {item.active || !item.href ? (
            <span className={`font-medium ${item.active ? "text-[#00E6F6] drop-shadow-[0_0_8px_rgba(0,230,246,0.3)]" : "text-gray-500"}`}>
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-[#00E6F6] transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
