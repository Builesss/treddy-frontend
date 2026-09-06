"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  width?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder,
  icon,
  width = "w-48",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0A0F2C] border border-[#1e293b] hover:border-cyan-500/50 text-white text-sm px-3.5 py-2 rounded-xl flex items-center justify-between gap-2 focus:outline-none transition-all shadow-md"
      >
        <span className="flex items-center gap-2 truncate">
          {icon}
          {selectedOption ? selectedOption.label : placeholder || "Seleccionar..."}
        </span>
        <ChevronDown
          size={16}
          className={`text-cyan-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 w-full min-w-[170px] bg-[#0F173A] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden py-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-cyan-500/20 text-[#00E6F6] font-semibold"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={14} className="text-[#00E6F6]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
