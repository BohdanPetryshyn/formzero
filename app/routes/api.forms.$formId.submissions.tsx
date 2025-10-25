import type { Route } from "./+types/api.forms.$formId.submissions";
import { data, redirect } from "react-router";

export async function action({ request, params, context }: Route.ActionArgs) {
  const { formId } = params;
  const db = context.cloudflare.env.DB;

  // Determine if this is a JSON request (used throughout)
  const acceptHeader = request.headers.get("accept") || "";
  const isJsonRequest = acceptHeader.includes("application/json");

  try {
    // Check if form exists
    const form = await db
      .prepare("SELECT id FROM forms WHERE id = ?")
      .bind(formId)
      .first();

    if (!form) {
      if (isJsonRequest) {
        return data(
          { success: false, error: "Form not found" },
          { status: 404 }
        );
      }
      return redirect("/error?error=form_not_found");
    }

    // Parse request body based on content type
    const contentType = request.headers.get("content-type") || "";
    let submissionData: Record<string, any>;

    if (contentType.includes("application/json")) {
      submissionData = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await request.formData();
      submissionData = Object.fromEntries(formData);
    } else {
      if (isJsonRequest) {
        return data(
          { success: false, error: "Unsupported content type" },
          { status: 415 }
        );
      }
      return redirect("/error?error=unsupported_content_type");
    }

    // Generate submission ID and timestamp
    const submissionId = crypto.randomUUID();
    const createdAt = Date.now();

    // Store submission in database
    await db
      .prepare(
        "INSERT INTO submissions (id, form_id, data, created_at) VALUES (?, ?, ?, ?)"
      )
      .bind(submissionId, formId, JSON.stringify(submissionData), createdAt)
      .run();

    if (isJsonRequest) {
      // Return JSON response
      return data(
        { success: true, id: submissionId },
        { status: 201 }
      );
    } else {
      // Handle redirect for HTML form submissions
      const url = new URL(request.url);
      const redirectParam = url.searchParams.get("redirect");
      const referer = request.headers.get("referer");

      let redirectUrl: string;

      if (redirectParam) {
        redirectUrl = redirectParam;
      } else if (referer) {
        redirectUrl = referer;
      } else {
        redirectUrl = "/success";
      }

      return redirect(redirectUrl, 303);
    }
  } catch (error) {
    console.error("Error processing form submission:", error);

    if (isJsonRequest) {
      return data(
        { success: false, error: "Failed to process submission" },
        { status: 500 }
      );
    } else {
      return redirect("/error?error=internal_error");
    }
  }
}
