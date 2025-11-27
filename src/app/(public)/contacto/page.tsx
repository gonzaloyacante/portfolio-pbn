import ContactForm from '@/components/public/ContactForm'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-script text-wine dark:text-pink-hot mb-4 text-5xl md:text-6xl">
            Contacto
          </h1>
          <p className="text-wine/70 dark:text-pink-light/70 mx-auto max-w-2xl text-lg">
            ¿Tienes alguna pregunta o quieres agendar una cita? Envíame un mensaje y te responderé
            lo antes posible.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="bg-pink-hot dark:bg-pink-hot/20 rounded-4xl p-8 shadow-lg">
              <h2 className="font-primary text-wine dark:text-pink-light mb-6 text-2xl font-bold">
                Información
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-wine text-pink-light dark:bg-purple-dark flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-wine dark:text-pink-light font-semibold">Email</h3>
                    <p className="text-wine/70 dark:text-pink-light/70">contacto@paolamakeup.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-wine text-pink-light dark:bg-purple-dark flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-wine dark:text-pink-light font-semibold">Ubicación</h3>
                    <p className="text-wine/70 dark:text-pink-light/70">
                      Ciudad Autónoma de Buenos Aires
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-wine text-pink-light dark:bg-purple-dark flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-wine dark:text-pink-light font-semibold">Horario</h3>
                    <p className="text-wine/70 dark:text-pink-light/70">Lun - Vie: 9:00 - 18:00</p>
                    <p className="text-wine/70 dark:text-pink-light/70">Sáb: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
