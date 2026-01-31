import { requireAuth } from "~/lib/require-auth.server"
import type { Route } from "./+types/settings.notifications"
import { data } from "react-router"

export async function loader({ context, request }: Route.LoaderArgs) {
  const database = context.cloudflare.env.DB

  // Fetch global settings
  const settings = await database
    .prepare("SELECT * FROM settings WHERE id = 'global'")
    .first()

  return data({
    settings: settings || null,
  })
}

export async function action({ request, context }: Route.ActionArgs) {
  const database = context.cloudflare.env.DB

  await requireAuth(request, database)

  // Handle DELETE request - clear settings
  if (request.method === "DELETE") {
    try {
      await database
        .prepare("DELETE FROM settings WHERE id = 'global'")
        .run()

      return data({ success: true }, { status: 200 })
    } catch (error) {
      console.error("Error clearing settings:", error)
      return data(
        { success: false, error: "Failed to clear settings" },
        { status: 500 }
      )
    }
  }

  // Handle POST request - save settings
  if (request.method !== "POST") {
    return data(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    )
  }

  try {
    // Parse form data
    const formData = await request.formData()
    const notification_email = formData.get("notification_email") as string
    const use_resend = formData.get("use_resend") === "true"

    // For Resend mode, we only need notification_email
    // For SMTP mode, we need all fields
    if (!notification_email) {
      return data(
        { success: false, error: "Email address is required" },
        { status: 400 }
      )
    }

    // SMTP fields are only required when not using Resend
    const notification_email_password = formData.get("notification_email_password") as string | null
    const smtp_host = formData.get("smtp_host") as string | null
    const smtp_port = formData.get("smtp_port") as string | null

    // Validate SMTP fields when not using Resend
    if (!use_resend && (!notification_email_password || !smtp_host || !smtp_port)) {
      return data(
        { success: false, error: "Missing SMTP configuration" },
        { status: 400 }
      )
    }

    // Check if global settings already exist
    const existingSettings = await database
      .prepare("SELECT id FROM settings WHERE id = 'global'")
      .first()

    const updatedAt = Date.now()

    // Parse smtp_port safely (null if not provided)
    const smtpPortNum = smtp_port ? parseInt(smtp_port, 10) : null

    if (existingSettings) {
      // Update existing settings
      await database
        .prepare(`
          UPDATE settings
          SET notification_email = ?,
              notification_email_password = ?,
              smtp_host = ?,
              smtp_port = ?,
              smtp_secure = 1,
              updated_at = ?
          WHERE id = 'global'
        `)
        .bind(
          notification_email,
          notification_email_password,
          smtp_host,
          smtpPortNum,
          updatedAt
        )
        .run()
    } else {
      // Create new global settings
      await database
        .prepare(`
          INSERT INTO settings (
            id,
            notification_email,
            notification_email_password,
            smtp_host,
            smtp_port,
            smtp_secure,
            updated_at
          ) VALUES ('global', ?, ?, ?, ?, 1, ?)
        `)
        .bind(
          notification_email,
          notification_email_password,
          smtp_host,
          smtpPortNum,
          updatedAt
        )
        .run()
    }

    return data({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error saving settings:", error)
    return data(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    )
  }
}
