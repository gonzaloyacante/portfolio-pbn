// Express routes for contact form submissions
import express, { type Request, type Response } from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate, authorize } from "../middleware/auth"
import nodemailer from "nodemailer"

const router = express.Router()
const prisma = new PrismaClient()

// Configure email service
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// POST submit contact form (public)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Create contact record
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: "NEW",
      },
    })

    // Send email notification to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nuevo mensaje de contacto: ${subject}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ""}
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Hemos recibido tu mensaje",
      html: `
        <h2>Gracias por contactarme</h2>
        <p>Hola ${name},</p>
        <p>He recibido tu mensaje y te responderé lo antes posible.</p>
        <p>Saludos,<br>Paola Bolívar Nievas</p>
      `,
    })

    res.status(201).json({ message: "Contact form submitted successfully", contact })
  } catch (error) {
    console.error("Contact form error:", error)
    res.status(500).json({ error: "Failed to submit contact form" })
  }
})

// GET all contacts (admin only)
router.get("/", authenticate, authorize(["admin"]), async (req: Request, res: Response) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json(contacts)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" })
  }
})

// GET contact by id (admin only)
router.get("/:id", authenticate, authorize(["admin"]), async (req: Request, res: Response) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: req.params.id },
    })
    if (!contact) return res.status(404).json({ error: "Contact not found" })
    res.json(contact)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact" })
  }
})

// PUT update contact status (admin only)
router.put("/:id", authenticate, authorize(["admin"]), async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { status, notes },
    })
    res.json(contact)
  } catch (error) {
    res.status(400).json({ error: "Failed to update contact" })
  }
})

// DELETE contact (admin only)
router.delete("/:id", authenticate, authorize(["admin"]), async (req: Request, res: Response) => {
  try {
    await prisma.contact.delete({ where: { id: req.params.id } })
    res.json({ message: "Contact deleted" })
  } catch (error) {
    res.status(400).json({ error: "Failed to delete contact" })
  }
})

export default router
