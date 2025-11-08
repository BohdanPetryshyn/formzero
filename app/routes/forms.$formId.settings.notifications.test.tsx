import type { Route } from "./+types/forms.$formId.settings.notifications.test"
import { data } from "react-router"
import nodemailer from "nodemailer"

export async function action({ request, params, context }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return data(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    )
  }

  const { formId } = params
  const db = context.cloudflare.env.DB

  try {
    // Check if form exists
    const form = await db
      .prepare("SELECT id FROM forms WHERE id = ?")
      .bind(formId)
      .first()

    if (!form) {
      return data(
        { success: false, error: "Form not found" },
        { status: 404 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const notification_email = formData.get("notification_email") as string
    const notification_email_password = formData.get("notification_email_password") as string
    const smtp_host = formData.get("smtp_host") as string
    const smtp_port = formData.get("smtp_port") as string

    // Validate required fields
    if (!notification_email || !notification_email_password || !smtp_host || !smtp_port) {
      return data(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: parseInt(smtp_port, 10),
      auth: {
        user: notification_email,
        pass: notification_email_password,
      },
    })

    // Send test email
    const info = await transporter.sendMail({
      from: notification_email,
      to: notification_email,
      subject: "FormZero - Test Email",
      text: "This is a test email from FormZero. Your SMTP settings are working correctly!",
      html: "<p>This is a test email from <strong>FormZero</strong>.</p><p>Your SMTP settings are working correctly!</p>",
    })

    return data({ success: true, messageId: info.messageId }, { status: 200 })
  } catch (error) {
    console.error("Error testing email settings:", error)

    // Provide more specific error message
    let errorMessage = "Failed to send test email"
    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        errorMessage = "Invalid email or password"
      } else if (error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
        errorMessage = "Cannot connect to SMTP server"
      } else {
        errorMessage = error.message
      }
    }

    return data(
      { success: false, error: errorMessage },
      { status: 400 }
    )
  }
}
