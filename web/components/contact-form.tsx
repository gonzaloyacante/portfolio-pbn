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
      const response = await fetch("/api/contacts", {
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
        <div className="animate-fade-in-up animation-delay-100">
          <FormInput
            label="Nombre"
            placeholder="Tu nombre completo"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            error={errors.name}
            required
          />
        </div>
        <div className="animate-fade-in-up animation-delay-200">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-fade-in-up animation-delay-300">
          <FormInput
            label="Teléfono"
            type="tel"
            placeholder="+34 123 456 789"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
          />
        </div>
        <div className="animate-fade-in-up animation-delay-300">
          <FormInput
            label="Asunto"
            placeholder="¿Cuál es el tema?"
            value={formData.subject}
            onChange={(value) => setFormData({ ...formData, subject: value })}
            error={errors.subject}
            required
          />
        </div>
      </div>

      <div className="animate-fade-in-up animation-delay-500">
        <FormTextarea
          label="Mensaje"
          placeholder="Cuéntame sobre tu proyecto..."
          value={formData.message}
          onChange={(value) => setFormData({ ...formData, message: value })}
          error={errors.message}
          required
        />
      </div>

      {submitStatus === "success" && (
        <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl text-green-700 animate-scale-in-pop shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">¡Mensaje enviado exitosamente!</p>
              <p className="text-sm text-green-600">Te contactaremos pronto.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-400 rounded-xl text-red-700 animate-shake shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Error al enviar el mensaje</p>
              <p className="text-sm text-red-600">Por favor intenta de nuevo.</p>
            </div>
          </div>
        </div>
      )}

      <div className="animate-fade-in-up animation-delay-500">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full md:w-auto bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 px-8 py-3 rounded-full text-lg font-semibold"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Enviar Mensaje
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
