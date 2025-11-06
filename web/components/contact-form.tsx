"use client"

import type React from "react"

import { useState } from "react"
import FormInput from "./form-input"
import FormTextarea from "./form-textarea"
import { Button } from "./button"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email inválido"
    if (!formData.subject.trim()) newErrors.subject = "El asunto es requerido"
    if (!formData.message.trim()) newErrors.message = "El mensaje es requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        setTimeout(() => setSubmitStatus("idle"), 5000)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Nombre"
          placeholder="Tu nombre completo"
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          error={errors.name}
          required
        />
        <FormInput
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          error={errors.email}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Teléfono"
          type="tel"
          placeholder="+1 (234) 567-890"
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
        />
        <FormInput
          label="Asunto"
          placeholder="¿Cuál es el tema?"
          value={formData.subject}
          onChange={(value) => setFormData({ ...formData, subject: value })}
          error={errors.subject}
          required
        />
      </div>

      <FormTextarea
        label="Mensaje"
        placeholder="Cuéntame sobre tu proyecto..."
        value={formData.message}
        onChange={(value) => setFormData({ ...formData, message: value })}
        error={errors.message}
        required
      />

      {submitStatus === "success" && (
        <div className="p-4 bg-green-100 border-2 border-green-500 rounded-lg text-green-700 animate-fade-in">
          ¡Mensaje enviado exitosamente! Te contactaremos pronto.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-accent/10 border-2 border-accent rounded-lg text-accent animate-fade-in">
          Error al enviar el mensaje. Por favor intenta de nuevo.
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
      </Button>
    </form>
  )
}
