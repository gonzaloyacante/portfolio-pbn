export const DESIGN_TOKENS = {
  // Colors - Light Mode (corrected from Canva design)
  light: {
    background: "#fff1f9", // Rosa claro
    foreground: "#6c0a0a", // Rojo oscuro
    card: "#ffaadd", // Rosa oscuro
    cardForeground: "#6c0a0a",
    primary: "#6c0a0a",
    primaryForeground: "#fff1f9",
    secondary: "#ffaadd",
    accent: "#ff69b4",
    border: "#ffe0ed",
    error: "#c41e3a",
    success: "#10b981",
    warning: "#f59e0b",
  },
  // Colors - Dark Mode
  dark: {
    background: "#2d0a0a", // Rojo muy oscuro
    foreground: "#ffaadd", // Rosa oscuro
    card: "#ffaadd",
    cardForeground: "#6c0a0a",
    primary: "#ffaadd",
    primaryForeground: "#2d0a0a",
    secondary: "#ffaadd",
    accent: "#ff69b4",
    border: "#6c0a0a",
    error: "#ff6b6b",
    success: "#51cf66",
    warning: "#ffa94d",
  },
  // Spacing
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  // Typography
  typography: {
    heading: {
      family: "Great Vibes, cursive",
      weight: 700,
    },
    body: {
      family: "Geist, sans-serif",
      weight: 400,
    },
  },
  // Border Radius
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  // Transitions
  transitions: {
    fast: "150ms ease-in-out",
    base: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },
}

export const NAVIGATION_ITEMS = [
  { id: "home", label: "Inicio" },
  { id: "about", label: "Sobre mi" },
  { id: "projects", label: "Proyectos" },
  { id: "contact", label: "Contacto" },
]
