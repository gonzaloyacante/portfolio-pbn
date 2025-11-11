"use client"

import { useState, useEffect } from "react"

interface ImageWithFallbackProps {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  objectFit?: "cover" | "contain" | "fill"
  isCircle?: boolean
  showSkeleton?: boolean
  onLoad?: () => void
}

export function ImageWithFallback({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  objectFit = "cover",
  isCircle = false,
  showSkeleton = true,
  onLoad,
}: ImageWithFallbackProps) {
  const [imageState, setImageState] = useState<"loading" | "error" | "success">(src ? "loading" : "error")

  useEffect(() => {
    if (!src) {
      setImageState("error")
    }
  }, [src])

  if (imageState === "loading" && showSkeleton) {
    return (
      <div
        className={`bg-gradient-to-r from-card/20 via-card/40 to-card/20 animate-shimmer ${
          isCircle ? "rounded-full" : "rounded-lg"
        } ${className}`}
        style={{
          width,
          height,
          backgroundSize: "1000px 100%",
        }}
      />
    )
  }

  if (imageState === "error" || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-card/30 to-card/10 flex items-center justify-center ${
          isCircle ? "rounded-full" : "rounded-lg"
        } ${className}`}
        style={{ width, height }}
      >
        <svg className="w-12 h-12 text-card/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden ${isCircle ? "rounded-full" : "rounded-lg"} ${className}`}
      style={{ width, height }}
    >
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={`w-full h-full object-${objectFit} transition-all duration-500 hover:scale-105`}
        onLoad={() => {
          setImageState("success")
          onLoad?.()
        }}
        onError={() => setImageState("error")}
      />
    </div>
  )
}
