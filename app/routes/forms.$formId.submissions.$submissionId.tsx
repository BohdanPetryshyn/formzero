import type { Route } from "./+types/forms.$formId.submissions.$submissionId"
import { data } from "react-router"
import { requireAuth } from "~/lib/require-auth.server"

export async function action({ request, params, context }: Route.ActionArgs) {
  const database = context.cloudflare.env.DB

  await requireAuth(request, database)

  if (request.method !== "DELETE") {
    return data(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    )
  }

  const { formId, submissionId } = params

  try {
    const result = await database
      .prepare("DELETE FROM submissions WHERE id = ? AND form_id = ?")
      .bind(submissionId, formId)
      .run()

    if (result.meta.changes === 0) {
      return data(
        { success: false, error: "Submission not found" },
        { status: 404 }
      )
    }

    return data({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting submission:", error)
    return data(
      { success: false, error: "Failed to delete submission" },
      { status: 500 }
    )
  }
}
