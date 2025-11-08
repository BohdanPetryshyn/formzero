import type { Route } from "./+types/forms.$formId.settings.notifications.test"
import { data } from "react-router"
import { sendTestEmail } from "~/lib/email.server"

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

    // Send test email using the email service
    const result = await sendTestEmail({
      notification_email,
      notification_email_password,
      smtp_host,
      smtp_port: parseInt(smtp_port, 10),
    })

    if (result.success) {
      return data(
        { success: true, messageId: result.messageId },
        { status: 200 }
      )
    } else {
      return data(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error testing email settings:", error)

    return data(
      { success: false, error: "Failed to send test email" },
      { status: 500 }
    )
  }
}
