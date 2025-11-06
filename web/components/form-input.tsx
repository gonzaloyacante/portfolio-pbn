"use client"

interface FormInputProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

export default function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
          error
            ? "border-accent bg-accent/10 focus:border-accent"
            : "border-border bg-background hover:border-primary/50 focus:border-primary"
        }`}
      />
      {error && <p className="text-sm text-accent">{error}</p>}
    </div>
  )
}
