"use client"

import type { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  fullWidth?: boolean
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = "font-medium transition-all duration-300 flex items-center justify-center gap-2 rounded-lg"

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 active:scale-95",
    secondary:
      "bg-secondary text-secondary-foreground hover:shadow-lg hover:shadow-secondary/30 disabled:opacity-50 active:scale-95",
    ghost: "text-foreground hover:bg-card/50 disabled:opacity-50 active:scale-95",
    outline: "border-2 border-primary text-primary hover:bg-primary/10 disabled:opacity-50 active:scale-95",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  )
}
