"use client"

import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  interactive?: boolean
  variant?: "default" | "elevated" | "outlined"
}

export default function Card({
  children,
  className = "",
  onClick,
  interactive = false,
  variant = "default",
}: CardProps) {
  const baseStyles = "rounded-2xl p-6 transition-all duration-300"

  const variantStyles = {
    default: "bg-card text-card-foreground",
    elevated: "bg-card text-card-foreground shadow-lg hover:shadow-xl",
    outlined: "bg-transparent border-2 border-border text-foreground hover:border-primary",
  }

  const interactiveStyles = interactive ? "cursor-pointer hover:shadow-lg hover:scale-105" : ""

  return (
    <div onClick={onClick} className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}>
      {children}
    </div>
  )
}
