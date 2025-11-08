import type { Route } from "./+types/forms.$formId.settings.notifications"
import { data } from "react-router"

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

    // Check if settings already exist for this form
    const existingSettings = await db
      .prepare("SELECT id FROM form_settings WHERE form_id = ?")
      .bind(formId)
      .first()

    const updatedAt = Date.now()

    if (existingSettings) {
      // Update existing settings
      await db
        .prepare(`
          UPDATE form_settings
          SET notification_email = ?,
              notification_email_password = ?,
              smtp_host = ?,
              smtp_port = ?,
              smtp_secure = 1,
              updated_at = ?
          WHERE form_id = ?
        `)
        .bind(
          notification_email,
          notification_email_password,
          smtp_host,
          parseInt(smtp_port, 10),
          updatedAt,
          formId
        )
        .run()
    } else {
      // Create new settings
      const settingsId = crypto.randomUUID()
      await db
        .prepare(`
          INSERT INTO form_settings (
            id,
            form_id,
            notification_email,
            notification_email_password,
            smtp_host,
            smtp_port,
            smtp_secure,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, 1, ?)
        `)
        .bind(
          settingsId,
          formId,
          notification_email,
          notification_email_password,
          smtp_host,
          parseInt(smtp_port, 10),
          updatedAt
        )
        .run()
    }

    return data({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error saving form settings:", error)
    return data(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    )
  }
}
