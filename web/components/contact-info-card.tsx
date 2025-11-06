"use client"

interface ContactInfoCardProps {
  icon: string
  title: string
  value: string
  href?: string
  type?: "email" | "phone" | "social"
}

export default function ContactInfoCard({ icon, title, value, href, type }: ContactInfoCardProps) {
  const content = (
    <div className="flex items-start gap-4 p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted mb-1">{title}</p>
        <p className="text-lg font-semibold text-foreground break-all">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target={type === "social" ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}
