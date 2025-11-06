"use client"

interface FormTextareaProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  rows?: number
}

export default function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  rows = 5,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none resize-none ${
          error
            ? "border-accent bg-accent/10 focus:border-accent"
            : "border-border bg-background hover:border-primary/50 focus:border-primary"
        }`}
      />
      {error && <p className="text-sm text-accent">{error}</p>}
    </div>
  )
}
