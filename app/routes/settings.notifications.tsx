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

    // Check if global settings already exist
    const existingSettings = await database
      .prepare("SELECT id FROM settings WHERE id = 'global'")
      .first()

    const updatedAt = Date.now()

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
          parseInt(smtp_port, 10),
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
          parseInt(smtp_port, 10),
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
