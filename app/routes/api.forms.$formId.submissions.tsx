import type { Route } from "./+types/api.forms.$formId.submissions";
import { data, redirect } from "react-router";
import { sendSubmissionNotification } from "~/lib/email.server";
import type { EmailConfig } from "#/types/settings";

// CORS headers to allow submissions from any domain
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400",
};

// Handle preflight OPTIONS requests
export async function loader({ request }: Route.LoaderArgs) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // For non-OPTIONS requests to this endpoint, return method not allowed
  return data(
    { error: "Method not allowed" },
    { status: 405, headers: corsHeaders }
  );
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const { formId } = params;
  const db = context.cloudflare.env.DB;

  // Determine if this is a JSON request (used throughout)
  const contentType = request.headers.get("content-type") || "";
  const acceptHeader = request.headers.get("accept") || "";
  const isJsonRequest =
    acceptHeader.includes("application/json") ||
    contentType.includes("application/json");

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
          { status: 404, headers: corsHeaders }
        );
      }
      return redirect("/error?error=form_not_found");
    }

    // Parse request body based on content type
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
          { status: 415, headers: corsHeaders }
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

    // Send email notification asynchronously (don't await to avoid blocking response)
    // This runs in the background after the response is sent
    context.cloudflare.ctx.waitUntil(
      (async () => {
        try {
          // Fetch global settings
          const globalSettings = await db
            .prepare(
              "SELECT notification_email, notification_email_password, smtp_host, smtp_port FROM settings WHERE id = 'global'"
            )
            .first<{
              notification_email: string | null
              notification_email_password: string | null
              smtp_host: string | null
              smtp_port: number | null
            }>();

          // Check if email notifications are configured
          if (
            globalSettings?.notification_email &&
            globalSettings?.notification_email_password &&
            globalSettings?.smtp_host &&
            globalSettings?.smtp_port
          ) {
            // Fetch form name for email
            const formData = await db
              .prepare("SELECT name FROM forms WHERE id = ?")
              .bind(formId)
              .first<{ name: string }>();

            if (formData) {
              // Type-safe email config (null checks already done above)
              const emailConfig: EmailConfig = {
                notification_email: globalSettings.notification_email,
                notification_email_password: globalSettings.notification_email_password,
                smtp_host: globalSettings.smtp_host,
                smtp_port: globalSettings.smtp_port,
              };

              await sendSubmissionNotification(emailConfig, {
                id: submissionId,
                formId: formId,
                formName: formData.name,
                data: submissionData,
                createdAt: createdAt,
              });
            }
          }
        } catch (error) {
          // Log error but don't fail the request
          console.error("Failed to send email notification:", error);
        }
      })()
    );

    if (isJsonRequest) {
      // Return JSON response
      return data(
        { success: true, id: submissionId },
        { status: 201, headers: corsHeaders }
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
        { status: 500, headers: corsHeaders }
      );
    } else {
      return redirect("/error?error=internal_error");
    }
  }
}
