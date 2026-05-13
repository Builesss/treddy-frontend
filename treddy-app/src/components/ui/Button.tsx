"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
}

export default function Button({
  children,
  isLoading,
  variant = "primary",
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "relative flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:opacity-90",
    secondary: "bg-[#1a214f] text-white border border-[#2a3055] hover:bg-[#232d66] hover:border-cyan-500/30",
    outline: "border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10",
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
