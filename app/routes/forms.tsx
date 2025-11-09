import { Outlet, redirect, useLoaderData } from "react-router"
import type { Route } from "./+types/forms"
import type { Form } from "#/types/form"
import { AppSidebar } from "#/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "#/components/ui/sidebar"
import { requireAuth } from "~/lib/require-auth.server"

export async function loader({ context, request }: Route.LoaderArgs) {
  const database = context.cloudflare.env.DB

  const user = await requireAuth(request, database)

  // Fetch all forms
  const result = await database
    .prepare("SELECT id, name FROM forms ORDER BY created_at ASC")
    .all()

  const forms = result.results as Form[]

  // If no forms exist, redirect to create first form
  if (forms.length === 0) {
    return redirect("/setup")
  }

  // If we're at exactly /forms (with or without trailing slash) and forms exist, redirect to first form's submissions
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/$/, "") // Remove trailing slash
  if (pathname === "/forms") {
    return redirect(`/forms/${forms[0].id}/submissions`)
  }

  return { forms, user }
}

export async function action({ request, context }: Route.ActionArgs) {
  const database = context.cloudflare.env.DB

  await requireAuth(request, database)

  const formData = await request.formData()

  const name = formData.get("name") as string

  if (!name) {
    return { error: "Form name is required" }
  }

  // Generate a slug from the form name
  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  // Check if form with this ID already exists
  const existing = await database
    .prepare("SELECT id FROM forms WHERE id = ?")
    .bind(id)
    .first()

  if (existing) {
    return { error: "A form with this name already exists" }
  }

  const createdAt = Date.now()

  await database
    .prepare(
      "INSERT INTO forms (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)"
    )
    .bind(id, name, createdAt, createdAt)
    .run()

  return redirect(`/forms/${id}/submissions`)
}

export default function Forms() {
  const { forms, user } = useLoaderData<typeof loader>()

  return (
    <SidebarProvider>
      <AppSidebar forms={forms} user={user} />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
