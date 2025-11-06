"use client"

interface NavLinkProps {
  id: string
  label: string
  isActive: boolean
  onClick: () => void
  mobile?: boolean
}

export default function NavLink({ id, label, isActive, onClick, mobile = false }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`transition-all duration-300 font-medium ${
        mobile
          ? `w-full text-left px-4 py-3 rounded-lg ${
              isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-card/50"
            }`
          : `px-4 py-2 text-sm md:text-base ${
              isActive ? "bg-primary text-primary-foreground rounded-lg" : "text-foreground hover:opacity-80"
            }`
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  )
}
